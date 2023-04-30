<template>
<div class="">
   <!-- //SECTION - Alert -->
   <v-alert
      :type="alertType"
      :color="alertColor"
      :icon="alertIcon"
      dismissible
      text
      transition="fade-transition"
      :value="alertTrigger"
      >
      <span id="alertMessage"></span>
   </v-alert>
   <!-- //!SECTION -->

   <!-- //SECTION - Status Filter & New Data Btn -->
   <div class="d-flex align-center flex-wrap">
      <div class="me-2">
         <p class="mb-0 text-subtitle-2">Filter:</p>
      </div>
      <v-col cols="6" md="2">
         <v-select
            v-model="schoolId"
            :items="schools"
            item-text="name"
            item-value="id"
            label="Sekolah"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-select>
      </v-col>

      <!-- <v-col cols="6" md="2">
         <v-select
            v-model="statusId"
            :items="status"
            item-text="name"
            item-value="id"
            label="Status"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-select>
      </v-col> -->

      <!-- <v-col cols="6" md="2">
         <v-select
            v-model="categoryId"
            :items="categories"
            item-text="name"
            item-value="id"
            label="Kategori"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-select>
      </v-col>

      <v-col cols="6" md="2">
         <v-select
            v-model="dataTypeId"
            :items="dataTypes"
            item-text="name"
            item-value="id"
            label="Tipe Data"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-select>
      </v-col> -->
   </div>
   <!-- //!SECTION -->

   <!-- //SECTION -  Data Table-->
   <v-data-table
      :headers="headers"
      :items="items"
      :page-sync="current"
      :loading="loading"
      hide-default-footer
      class="mb-3"
   >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.data_status.name="{item}">
         <v-chip
            class="font-weight-medium"
            :class="getColor(item.data_status_id)"
            pill
         >
            {{ item.data_status.name }}
         </v-chip>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.actions="{item}">
         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  class="me-2"
                  color="light-blue darken-2"
                  v-on="on"
                  @click="downloadFile(item)"
               >
                  <v-icon>mdi-file-download</v-icon>
               </v-btn>
            </template>
            <span>Download</span>
         </v-tooltip>
      </template>
   </v-data-table>
   <!-- //!SECTION -->

   <!-- //SECTION - Table footer & Pagination -->
   <div v-if="items" class="d-flex justify-space-between align-center">
      <p class="text-caption mb-0">
         {{ from }}-{{ to }} dari {{ total }} data
      </p>
      <v-pagination
         v-model="current"
         :length="totalPage"
         total-visible="7"
         prev-icon="mdi-menu-left"
         next-icon="mdi-menu-right"
         @input="dataHandler()"
      ></v-pagination>
   </div>
   <!-- //!SECTION -->

   <!-- //SECTION - Snackbar -->
   <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      text
   >
      {{ snackbarText }}

      <template #action="{ attrs }">
         <v-btn
            :color="snackbarColor"
            text
            v-bind="attrs"
            @click="snackbar = false"
         >
            Tutup
         </v-btn>
      </template>
   </v-snackbar>
   <!-- //!SECTION -->
</div>
</template>

<script>
export default {
   name: 'DataTable',
   props: {
      headers: {
         type: Array,
         default: () => {}
      },
      items: {
         type: Array,
         default: () => {}
      },
      totalPage: {
         type: Number,
         default: 0
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
      }
   },

   data() {
      return {
         current: this.currentPage ? this.currentPage : 1,
         
         schoolId: null,
         statusId: null,
         categoryId: null,
         dataTypeId: null,

         schools: [],
         status: [],
         categories: [],
         dataTypes: [],
         
         alertType: null,
         alertColor: null,
         alertIcon: null,
         alertMessage: null,
         alertTrigger: false,

         snackbarText: '',
         snackbar: false,
         snackbarColor: '',
      }
   },

   watch: {
      alertTrigger() {
         if (this.alertTrigger === true) {
            setTimeout(() => {
               this.onTriggeredAlert()
            }, 5000)
         }
      },
   },

   async mounted() {
      await this.$axios.get(`/getStatus`).then((resp) => {
         this.status = resp.data.data
      })

      await this.$axios.get(`/diknas/getAllSchool`).then((resp) => {
         this.schools = resp.data.data
      })
   },

   methods: {
      dataHandler() {
         this.$emit('data-handler', this.current, this.statusId, this.schoolId, this.categoryId, this.dataTypeId)
      },
      
      getColor(status) {
         if (status === 1) return "grey lighten-4"
         if (status === 2) return "green darken-1 white--text"
         if (status === 3) return "deep-orange darken-1 white--text"
         if (status === 4) return "cyan lighten-1 white--text"
      },

      getFileExtension(name) {
         const fileName = name
         const extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
         return extension
      },

      async downloadFile(item) {
         const fileExtension = this.getFileExtension(item.path)
         const filename = item.school.name + '_' + item.category + '_' + item.data_type.name + '_' + item.year + fileExtension

         try {
            await this.$axios({
               url: `/downloadFile`,
               method: "POST",
               responseType: 'blob',
               data: {
                  path: item.path
               }
            })
            .then((resp) => {
               const url = window.URL.createObjectURL(new Blob([resp.data]))
               const link = document.createElement('a')
               link.href = url
               link.setAttribute('download', filename)
               document.body.appendChild(link)
               link.click()
               document.body.removeChild(link)
               this.snackbarText = 'File berhasil diunduh.'
               this.snackbarColor = 'green darken-3'
               this.snackbar = true
            })
         } catch (e) {
            this.snackbarText = 'File tidak ditemukan.'
            this.snackbarColor = 'red darken-2'
            this.snackbar = true
         }
      },
   }
}
</script>

<style>
.v-pagination__navigation {
   transition: 0.3s cubic-bezier(0, 0, 0.2, 1);
}

.v-pagination__navigation, .v-pagination__item {
   box-shadow: none!important;
}

.v-pagination__navigation:hover, .v-pagination__item:hover:not(.v-pagination__item--active) {
   background-color: #eeeeee!important;
}
</style>