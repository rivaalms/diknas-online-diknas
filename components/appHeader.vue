<template>
<v-app-bar
   app
   outlined
   flat
   light
   clipped-left
   class="app-bar"
>
   <v-app-bar-nav-icon class="d block d-md-none" @click="$emit('toggle-sidebar')"></v-app-bar-nav-icon>
   <v-app-bar-title class="d-none d-md-block text-h6">diknas-online-diknas</v-app-bar-title>

   <v-spacer/>

   <v-menu offset-y>
      <template #activator="{on, attrs}">
         <v-list nav dense class="pa-0" color="transparent">
            <v-list-item
               v-bind="attrs"
               class="d-flex flex-shrink-1 flex-grow-0"
               v-on="on"
            >
               <!-- <v-list-item-avatar>
                  <v-img
                     src="https://api.dicebear.com/6.x/adventurer-neutral/svg?randomizeIds=true"
                  ></v-img>
               </v-list-item-avatar> -->
               <v-list-item-content>
                  <v-list-item-title>{{ $auth.user.name ?? '' }}</v-list-item-title>
               </v-list-item-content>
               <v-list-item-icon>
                  <v-icon>mdi-chevron-down</v-icon>
               </v-list-item-icon>
            </v-list-item>
         </v-list>
      </template>
      <v-list>
         <v-list-item
            to="/profile"
            router exact
         >
            <v-list-item-title>
               Profil
            </v-list-item-title>
         </v-list-item>

         <v-divider></v-divider>

         <v-list-item
            @click.stop="logout"
         >
            <v-list-item-title class="red--text">Keluar</v-list-item-title>
         </v-list-item>
      </v-list>
   </v-menu>
</v-app-bar>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
   methods: {
      ...mapMutations(['SET_IS_AUTH']),

      async logout() {
         await this.$auth.logout()
         this.SET_IS_AUTH(false)
         this.$router.push('/login')
      },
   }
}
</script>
