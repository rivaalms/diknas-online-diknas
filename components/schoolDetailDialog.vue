<template>
<v-dialog
   v-model="dialogTrigger"
   persistent
>
   <v-card v-if="dialog">
      <v-card-title class="justify-space-between">
         Detail Statistik {{ dialog.item.name }}
         <v-tooltip left color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  v-on="on"
                  @click.stop="closeDialog()"
               >
                  <v-icon>mdi-window-close</v-icon>
               </v-btn>
            </template>
            <span>Tutup</span>
         </v-tooltip>
      </v-card-title>
      
      <v-card-text>
         <v-tabs
            v-model="tab"
            grow
         >
            <v-tab>Siswa</v-tab>
            <v-tab>Guru</v-tab>
         </v-tabs>
      </v-card-text>
      <v-card-text>
         <v-tabs-items
            v-model="tab"
         >
            <v-tab-item class="py-4 px-1">
               <v-row>
                  <v-col cols="12" md="3">
                     <v-card>
                        <v-card-text>
                           <p class="mb-2">Jumlah Siswa</p>
                           <p class="text-h4 font-weight-medium grey--text text--darken-4">{{ dialog.item.total_students }}</p>
                        </v-card-text>
                     </v-card>
                  </v-col>
                  <v-col v-for="students in dialog.item.students" :key="students.grade" cols="12" md="3">
                     <v-card>
                        <v-card-text>
                           <p class="mb-2">Kelas {{ students.grade }}</p>
                           <p class="text-h4 font-weight-medium grey--text text--darken-4">{{ students.total }}</p>
                        </v-card-text>
                     </v-card>
                  </v-col>
                  <v-col cols="12" class="mt-6">
                     <p class="text-h6">Data Siswa Berdasarkan Agama</p>
                     <v-data-table
                        hide-default-footer
                        :headers="dialog.studentHeader"
                        :items="dialog.item.students"
                     >
                        <!-- eslint-disable-next-line vue/valid-v-slot -->
                        <template #item.grade="{item}">
                           Kelas {{ item.grade }}
                        </template>
                     </v-data-table>
                  </v-col>
               </v-row>
            </v-tab-item>

            <v-tab-item class="py px-1">
               <v-data-table
                  :headers="dialog.teacherHeader"
                  :items="dialog.teacherItem"
                  :items-per-page="5"
               >
               <!-- eslint-disable-next-line vue/valid-v-slot -->
               <template #item.subject="{ item }">
                  {{ (item.subject === 'math') ? 'Matematika' 
                  : (item.subject === 'ind_lit') ? 'Bahasa Indonesia' 
                  : (item.subject === 'eng_lit') ? 'Bahsa Inggris' 
                  : (item.subject === 'science') ? 'Ilmu Pengetahuan Alam' 
                  : (item.subject === 'social') ? 'Ilmu Pengetahuan Sosial' 
                  :(item.subject === 'civic') ? 'Pendidikan Kewarganegaraan' 
                  : (item.subject === 'islam') ? 'Pendidikan Agama Islam' 
                  : (item.subject === 'catholic') ? 'Pendidikan Agama Katolik' 
                  : (item.subject === 'protestant') ? 'Pendidikan Agama Protestan' 
                  : (item.subject === 'hindu') ? 'Pendidikan Agama Hindu' 
                  : (item.subject === 'buddha') ? 'Pendidikan Agama Buddha' 
                  : (item.subject === 'konghucu') ? 'Pendidikan Agama Konghucu' 
                  : (item.subject === 'counseling') ? 'Bimbingan Konseling' 
                  : (item.subject === 'sports') ? 'Pendidikan Jasmani, Olahraga dan Kesehatan' 
                  : (item.subject === 'art') ? 'Seni Budaya dan Keterampilan'
                  : (item.subject === 'entrepreneurship') ? 'Kewirausahaan'
                  : 'Total' }}
               </template>
               </v-data-table>
            </v-tab-item>
         </v-tabs-items>
      </v-card-text>
   </v-card>
</v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
   data() {
      return {
         tab: null
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogTrigger'])
   },

   watch: {
      dialogTrigger() {
         if (!this.dialogTrigger) {
            this.tab = null
            setTimeout(() => {
               this.$store.dispatch('clearDialog')
            }, 500)
         }
      }
   },

   methods: {
      closeDialog() {
         this.$store.dispatch('closeDialog')
      }
   }
}
</script>