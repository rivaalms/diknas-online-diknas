<template>
<v-container fluid>
   <div class="mb-6">
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Dashboard</p>
         <v-breadcrumbs
            :items="breadcrumb"
            class="px-0 py-2"
         >
            <template #item="{item}">
               <v-breadcrumbs-item
                  exact
                  :to="item.href"
                  :disabled="item.disabled"
               >{{ item.text }}</v-breadcrumbs-item>
            </template>
         </v-breadcrumbs>
      </div>
      <v-row dense>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Semua Data yang Sudah Terverifikasi
               </v-card-title>
               <v-card-text>
                  <data-table
                     :headers="tableHeaders"
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
import dataTable from '@/pages/components/table'

export default {
   name: 'Dashboard',

   components: { dataTable },
   
   data() {
      return {
         user: this.$auth.user,

         tableHeaders: [
            {
               text: 'ID',
               value: 'id'
            },
            {
               text: 'Nama Sekolah',
               value: 'school.name'
            },
            {
               text: 'Tipe data',
               value: 'data_type.name',
            },
            {
               text: 'Kategori',
               sortable: false,
               value: 'data_type.data_category.name',
            },
            {
               text: 'Tahun ajaran',
               value: 'year',
            },
            // {
            //    text: 'Status',
            //    sortable: false,
            //    value: 'data_status.name',
            // },
            {
               text: 'Aksi',
               sortable: false,
               value: 'actions',
            },
         ],
         data: [],
         loading: true,
      }
   },

   computed: {
      breadcrumb() {
         const data = [
            {text: 'Dashboard', disabled: true, href: '/'},
         ]
         return data
      }
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