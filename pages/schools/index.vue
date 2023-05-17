<template>
   <v-container fluid>
      <div>
         <div class="d-flex justify-space-between align-center mt-5 mb-8">
            <p class="text-h6 mb-0">Statistik Sekolah</p>
            <app-breadcrumb/>
         </div>
         <v-row dense>
            <v-col cols="12">
               <v-card flat>
                  <v-card-title class="text-subtitle-1">
                     Data Statistik Sekolah
                  </v-card-title>
                  <v-card-text>
                     <schools-table
                        :headers="headers"
                        :items="data.data"
                        :current-page="data.current_page"
                        :total-page="data.last_page"
                        :loading="loading"
                        :from="data.from"
                        :to="data.to"
                        :total="data.total"
                        @data-handler="(current, school_id) => getSchools(current, school_id)"
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
      data() {
         return {
            headers: [
               {
                  text: 'Nama Sekolah',
                  value: 'name'
               },
               {
                  text: 'Kepala Sekolah',
                  value: 'principal'
               },
               {
                  text: 'Pengawas',
                  value: 'supervisor.name'
               },
               {
                  text: 'Email',
                  value: 'email'
               },
               {
                  text: 'Jumlah Siswa',
                  value: 'total_students'
               },
               {
                  text: 'Jumlah Guru',
                  value: 'total_teachers'
               },
               {
                  text: 'Aksi',
                  value: 'actions'
               }
            ],
            data: [],
            loading: false,
         }
      },
   
      created() {
         this.$store.dispatch('setBreadcrumb', [
            { text: 'Dashboard', disabled: false, href: '/' },
            { text: 'Statistik Sekolah Binaan', disabled: true, 'href': '/school' }
         ])
      },
      
      async mounted() {
         await this.getSchools()
      },
   
      methods: {
         async getSchools(current, schoolId) {
            this.loading = true
            await this.$axios.get(`/diknas/getSchoolStats`, {
               params: {
                  page: current,
                  school: schoolId,
               }
            }).then((resp) => {
               this.data = resp.data.data
               this.loading = false
            })
         }
      }
   }
   </script>