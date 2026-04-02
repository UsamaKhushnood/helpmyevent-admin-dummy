import { Device } from '@twilio/voice-sdk'
import { useTwilioStore } from '@/stores'
import eventBus from '@/services/eventBus'

export default class Twilio {
  constructor() {
    this.device = null
    this.call = null
    this.store = useTwilioStore()
    this.setup()
  }

  async getAccessToken() {
    return await useTwilioStore().getAccessToken()
  }

  setup() {
    this.getAccessToken().then((token) => {
      this.device = new Device(token, {
        allowIncomingWhileBusy: false
      })

      this.bindDeviceEvents()
      this.device.register()
    })
  }

  destroy() {
    this.device.destroy()
  }

  async placeCall(client) {
    const call = await this.device?.connect({
      params: { To: client }
    })
    this.initCall(call)
  }

  async acceptCall() {
    await this.call?.accept()
  }

  initCall(call) {
    this.call = call
    if (this.call) {
      this.bindCallEvents()
    }
  }

  async handleIncomingCall(call) {
    useTwilioStore()
      .getCallerInfo(call.parameters.From.split(':')[1])
      .then(() => {
        this.store.isIncomingCall(true)
        this.updateCallStatus('ringing')
        eventBus.emit('showCallDialog')
        this.initCall(call)
      })
  }

  async forwardCall() {
    const token = await this.getAccessToken()
    const device = new Device(token)
    const call = await device.connect({ connectToken: this.call.connectToken })

    call.on('cancel', () => {
      device.destroy()
    })
    call.on('disconnect', () => {
      device.destroy()
    })
    call.on('error', () => {
      device.destroy()
    })
    call.on('reject', () => {
      device.destroy()
    })

    this.initCall(call)
  }

  bindDeviceEvents() {
    this.device.on('destroyed', () => this.updateDeviceStatus('destroyed'))
    this.device.on('error', (error) => this.updateDeviceStatus('error', error))
    this.device.on('registered', () => {
      this.store.initialized = true
      this.updateDeviceStatus('registered')
    })
    this.device.on('registering', () => this.updateDeviceStatus('registering'))
    this.device.on('unregistered', () => this.updateDeviceStatus('unregistered'))

    this.device.on('tokenWillExpire', async () => {
      this.getAccessToken().then((token) => {
        this.device.updateToken(token)
      })
    })

    this.device.on('incoming', async (call) => {
      await this.handleIncomingCall(call)
    })
  }

  bindCallEvents() {
    this.call.on('accept', () => this.updateCallStatus('accepted'))
    this.call.on('cancel', () => this.updateCallStatus('cancelled'))
    this.call.on('disconnect', (twilioError) => {
      this.updateCallStatus('disconnected', twilioError.description)
      eventBus.emit('callDisconnected')
    })
    this.call.on('error', (error) => this.updateCallStatus('error', error))
    this.call.on('mute', (isMuted) => this.updateCallMuteStatus(isMuted))
    this.call.on('reconnected', () => this.updateCallStatus('reconnected'))
    this.call.on('reconnecting', (twilioError) =>
      this.updateCallStatus('reconnecting', twilioError)
    )
    this.call.on('reject', () => this.updateCallStatus('rejected'))
    this.call.on('ringing', () => this.updateCallStatus('ringing'))
    this.call.on('warning-cleared', (warningName) => {
      if (warningName === 'low-mos') {
        this.updateCallStatus('qualityNormal')
      }
    })
    this.call.on('warning', (warningName, warningData) => {
      if (warningName === 'low-mos') {
        this.updateCallStatus('lowQuality', warningData)
        /* Prints the following
          {
            // Stat name
            "name": "mos",

            // Array of mos values in the past 5 samples that triggered the warning
            "values": [2, 2, 2, 2, 2],

            // Array of samples collected that triggered the warning.
            // See sample object format here https://www.twilio.com/docs/voice/sdks/javascript/twiliocall#sample-event
            "samples": [...],

            // The threshold configuration.
            // In this example, low-mos warning will be raised if the value is below 3
            "threshold": {
              "name": "min",
              "value": 3
            }
          }
         */
      }
    })
  }

  updateDeviceStatus(status, error = null) {
    this.store.deviceStatus = status
    if (error) this.store.deviceError = error
  }

  updateCallStatus(status, data = null) {
    switch (status) {
      case 'cancelled':
      case 'disconnected':
      case 'error':
      case 'rejected':
        this.endCall()
        break
    }

    this.store.callStatus = status
    if (data) this.store.callData = data
  }

  updateCallMuteStatus(status) {
    this.store.callMuted = status
  }

  endCall() {
    eventBus.emit('callDisconnected')
    this.call = null
    setTimeout(() => {
      this.store.callStatus = null
    }, 5000)
  }
}
