<template>
   <v-container fluid>
      <div>
         <div class="d-flex justify-space-between align-center mt-5 mb-8">
            <p class="text-h6 mb-0">Statistik Sekolah</p>
            <app-breadcrumb/>
         </div>
         <v-row dense>
            <v-col
               v-for="(item, key) in countSchool"
               :key="key"
            >
               <v-card flat>
                  <v-card-title class="text-subtitle-1">
                     {{ (key === 'total') ? 'Jumlah Sekolah' : (key === 'smp') ? 'SMP' : (key === 'sd') ? 'SD' : '' }}
                  </v-card-title>
                  <v-card-text class="text-h4 font-weight-medium grey--text text--darken-3">
                     {{ item }}
                  </v-card-text>
               </v-card>
            </v-col>
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
            countSchool: [],
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
         await this.$axios.get('/countSchool').then((resp) => {
            this.countSchool = resp.data.data
         })
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