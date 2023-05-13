<template>
   <v-container fluid>
      <div class="mb-6">
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
         async getSchools() {
            await this.$axios.get(`/diknas/getSchoolStats`).then((resp) => {
               this.data = resp.data.data
            })
         }
      }
   }
   </script>