<template>
<v-container fluid>
   <div>
      <page-header
         :title="'Dashboard'"
      />
      <v-row dense>
         <v-col
            v-for="item in schoolSupervisorCount"
            :key="item.title"
         >
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               {{ item.title }}
            </v-card-title>
            <v-card-text class="text-h4 font-weight-medium grey--text text--darken-3">
               {{ item.value }}
            </v-card-text>
         </v-card>
         </v-col>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Semua Data yang Sudah Terverifikasi
               </v-card-title>
               <v-card-text>
                  <data-table
                     :items="data.data"
                     :total-page="data.last_page"
                     :current-page="data.current_page"
                     :from="data.from"
                     :to="data.to"
                     :total="data.total"
                     :loading="loading"
                     @data-handler="(current, status_id, school_id, year) => dataHandler(current, status_id, school_id, year)"
                  />
               </v-card-text>
            </v-card>
         </v-col>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Kategori Data
               </v-card-title>
               <v-card-text>
                  <v-row dense>
                     <v-col
                        v-for="item in categories"
                        :key="item.slug"
                        cols="6" sm="4" md="2">
                        <v-card
                           flat
                           outlined
                           height="100%"
                           class="v-btn text-capitalize"
                           router exact
                           :to="{name: 'category-slug', params: { slug: item.slug }}"
                        >
                           <v-card-text>
                              {{ item.name }}
                           </v-card-text>
                        </v-card>
                     </v-col>
                  </v-row>
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </div>
</v-container>
</template>

<script>
export default {
   name: 'Dashboard',

   data() {
      return {
         user: this.$auth.user,

         data: [],
         loading: true,
         categories: [],
         schoolSupervisorCount: [],
      }
   },

   created() {
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: true, href: '/' }
      ])
   },

   async mounted() {
      await this.$axios.get(`/getData`, {
         params: {
            status: 2,
         }
      }).then((resp) => {
         this.data = resp.data.data
         this.loading = false
      })
      await this.$axios.get(`/getCategories`).then((resp) => {
         this.categories = resp.data.data
      })
      await this.$axios.get('/getSchoolSupervisorCount').then((resp) => {
         this.schoolSupervisorCount = resp.data.data
      })
   },

   methods: {
      dataHandler(current, statusId, schoolId, year) {
         this.loading = true
         this.$axios.get(`/getData`, {
            params: {
               page: current,
               status: statusId,
               school: schoolId,
               year,
            }
         }).then((resp) => {
            this.data = resp.data.data
            this.loading = false
         })
      },
   }
}
</script>