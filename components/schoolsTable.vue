<template>
   <div>
      <!-- //SECTION - Schools table -->
      <v-data-table
         :headers="headers"
         :items="items"
         :page.sync="current"
         :loading="loading"
         hide-default-footer
         class="mb-3"
      >
         <!-- //SECTION - Action Buttons -->
         <!-- eslint-disable-next-line vue/valid-v-slot -->
         <template #item.actions="{ item }">
            <v-tooltip top color="black">
               <template #activator="{on, attrs}">
                  <v-btn
                     v-bind="attrs"
                     icon
                     class="me-2"
                     color="cyan"
                     v-on="on"
                     @click="dialog(item)"
                  >
                     <v-icon>mdi-eye-outline</v-icon>
                  </v-btn>
               </template>
               <span>Lihat detail</span>
            </v-tooltip>
         </template>
         <!-- //!SECTION -->
      </v-data-table>
      <!-- //!SECTION -->
   
      <lazy-school-detail-dialog/>
   </div>
   </template>
   
   <script>
   export default {
      props: {
         headers: {
            type: Array,
            default: () => {}
         },
         items: {
            type: Array,
            default: () => {}
         },
         currentPage: {
            type: Number,
            default: 0
         },
         loading: {
            type: Boolean,
            default: false
         },
         from: {
            type: Number,
            default: 0
         },
         to: {
            type: Number,
            default: 0
         },
         total: {
            type: Number,
            default: 0
         },
      },
   
      data() {
         return {
            current: this.currentPage ?? 1,
            dialogTrigger: false,
            targetItem: [],
            tab: null,
   
            studentHeaders: [
               {
                  text: 'Kelas',
                  value: 'grade'
               },
               {
                  text: 'Islam',
                  value: 'islam',
               },
               {
                  text: 'Katolik',
                  value: 'catholic'
               },
               {
                  text: 'Protestan',
                  value: 'protestant'
               },
               {
                  text: 'Hindu',
                  value: 'hindu'
               },
               {
                  text: 'Buddha',
                  value: 'buddha'
               },
               {
                  text: 'Konghucu',
                  value: 'konghucu'
               }
            ],
   
            teacherHeaders: [
               {
                  text: 'Mata Pelajaran',
                  value: 'subject',
               },
               {
                  text: 'Jumlah',
                  value: 'value'
               },
            ],
   
            teacherItems: []
         }
      },

      methods: {
         dialog(item) {
            const teacherItems = []
            for (const prop in item.teachers) {
               if (prop !== 'id' && prop !== 'school_id' && prop !== 'year' && prop !== 'created_at' && prop !== 'updated_at') {
                  teacherItems.push({subject: prop, value: item.teachers[prop]})
               }
            }
            teacherItems.unshift({subject: 'total', value: item.total_teachers})

            this.$store.dispatch('setDialog', {
               item,
               teacherItem: teacherItems,
               teacherHeader: this.teacherHeaders,
               studentHeader: this.studentHeaders,
            })
            this.$store.dispatch('showDialog')
         },
      }
   }
   </script>