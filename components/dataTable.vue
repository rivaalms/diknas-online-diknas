<template>
<div class="">
   <app-alert/>

   <!-- //SECTION - Status Filter & New Data Btn -->
   <div class="d-flex flex-column flex-md-row align-md-center flex-wrap">
      <div class="me-2">
         <p class="mb-0 text-subtitle-2">Filter:</p>
      </div>
      <v-col cols="12" md="3">
         <v-autocomplete
            v-model="schoolId"
            :items="schools"
            :loading="schoolFilterLoading"
            :search-input.sync="schoolInputSync"
            hide-no-data
            hide-selected
            item-text="name"
            item-value="id"
            label="Sekolah"
            placeholder="Ketik untuk mencari"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-autocomplete>
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
      <!-- <v-col cols="6" md="2">
         <v-select
            v-model="year"
            :items="yearList"
            item-text="year"
            item-value="year"
            label="Tahun Ajaran"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-select>
      </v-col> -->
      <v-col cols="12" md="3">
         <v-text-field
            v-model="year"
            label="Tahun ajaran"
            clearable
            append-icon="mdi-magnify"
            hide-details="auto"
            class="pt-0 mt-0"
            placeholder="Enter untuk mencari"
            @keydown.enter="dataHandler()"
            @click:clear="emptyYearDataHandler()"
            @click:append="dataHandler()"
         ></v-text-field>
      </v-col>
   </div>
   <!-- //!SECTION -->

   <!-- //SECTION -  Data Table-->
   <v-data-table
      :headers="tableHeader"
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
                  color="primary"
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
   <div v-if="items" class="d-flex flex-column flex-md-row justify-space-between align-center">
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

   <app-snackbar/>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
   name: 'DataTable',
   props: {
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
         statusId: 2,
         categoryId: null,
         dataTypeId: null,
         year: null,
         schoolFilterLoading: false,
         schoolInputSync: null,

         schools: [],
         status: [],
         categories: [],
         dataTypes: [],
         yearList: [],
      }
   },

   computed: {
      ...mapState(['tableHeader'])
   },

   watch: {
      schoolInputSync(val) {
         if (this.schools.length > 0) return
         if (this.schoolFilterLoading) return
         this.schoolFilterLoading = true
         this.$axios.get('/searchSchoolFilter').then((resp) => {
            this.schools = resp.data.data
         }).catch((e) => {
            console.log(e)
         }).finally(() => {
            this.schoolFilterLoading = false
         })
      },
   },

   async mounted() {
      await this.$axios.get(`/getStatus`).then((resp) => {
         this.status = resp.data.data
      })
   },

   methods: {
      dataHandler() {
         this.$emit('data-handler', this.current, this.statusId, this.schoolId, this.year)
      },

      emptyYearDataHandler() {
         this.year = null
         this.dataHandler()
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

               this.$store.dispatch('setSnackbar', {
                  text: 'File berhasil diunduh',
                  color: 'success'
               })
            })
         } catch (e) {
            this.$store.dispatch('setSnackbar', {
               text: 'File tidak ditemukan',
               color: 'error'
            })
         } finally {
            this.$store.dispatch('showSnackbar')
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