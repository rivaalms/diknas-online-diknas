<template>
<v-container fluid>
   <div>
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Dashboard</p>
         <app-breadcrumb/>
      </div>
      <v-row dense>
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
                     @data-handler="(current, status_id, school_id) => dataHandler(current, status_id, school_id)"
                  />
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
      }
   },

   created() {
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: true, href: '/' }
      ])
   },

   async mounted() {
      await this.$axios.get(`/diknas/getData`).then((resp) => {
         this.data = resp.data.data
         this.loading = false
      })
   },

   methods: {
      dataHandler(current, statusId, schoolId, categoryId, dataTypeId) {
         this.loading = true
         this.$axios.get(`/diknas/getData`, {
            params: {
               page: current,
               status: statusId,
               school: schoolId,
               category: categoryId,
               data_type: categoryId ? dataTypeId : null,
            }
         }).then((resp) => {
            this.data = resp.data.data
            this.loading = false
         })
      },
   }
}
</script>