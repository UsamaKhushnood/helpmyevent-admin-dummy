<template>
  <Card>
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>Enter your email below to login to your account</CardDescription>
    </CardHeader>
    <CardContent>
      <CForm :initialValues="form" :onSubmit="login" :schema="schema">
        <div class="space-y-6">
          <CField label="Email" name="email">
            <CInput v-model="form.email" placeholder="Enter your email address" type="text" />
          </CField>
          <CField label="Password" name="password">
            <PasswordInput v-model="form.password" placeholder="Enter password" />
          </CField>
          <div>
            <!-- <div class="text-right -mt-5">
              <RouterLink class="text-primary font-medium text-sm " to="/forgot-password">Forgot Password</RouterLink>
            </div> -->
            <Button :loading="loading" class="w-full mt-3" type="submit">
              Login
            </Button>
          </div>
        </div>
      </CForm>

    </CardContent>
  </Card>
</template>
<script>
import CField from '@/components/common/form/CField.vue'
import CForm from '@/components/common/form/CForm.vue'
import CInput from '@/components/common/form/CInput.vue'
import PasswordInput from '@/components/common/form/PasswordInput.vue'
import GoogleIcon from "@/components/icons/GoogleIcon.vue"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores'
import { email, helpers, required } from '@vuelidate/validators'
import { mapActions } from 'pinia'

export default {
  components: {
    GoogleIcon,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    CForm,
    CField,
    CInput,
    PasswordInput
  },
  data() {
    return {
      loading: false,
      redirecting: false,
      form: {
        email: '',
        password: '',
      },
      schema: {
        email: {
          email: helpers.withMessage('Type a valid email', email),
          required: helpers.withMessage('Email is required', required)
        },
        password: { required: helpers.withMessage('Password is required', required) },
      }
    }
  },
  methods: {
    ...mapActions(useAuthStore, { Login: 'Login', GetRedirectionUrl: 'GetRedirectionUrl' }),
    login() {
      this.loading = true
      this.Login(this.form).finally(() => {
        this.loading = false
      })
    },
    getRedirectionUrl() {
      this.redirecting = true
      this.GetRedirectionUrl().finally(() => {
        this.redirecting = false
      })
    }
  }
}
</script>
