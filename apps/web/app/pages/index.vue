<template>
  <main class="flex-1 flex overflow-hidden">
    <!-- Area Konten & Filter -->
    <div class="flex-1 flex flex-col overflow-y-auto">
      <!-- Header Konten -->
      <header
        class="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200"
      >
        <h2 class="text-2xl font-semibold text-slate-900">Media Library</h2>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari aset..."
              class="w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            class="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload Aset
          </button>
        </div>
      </header>

      <!-- Konten Utama (Galeri & Filter Folder) -->
      <div class="flex-1 p-6 flex">
        <!-- Filter Folder -->
        <nav class="w-56 pr-6">
          <h3
            class="text-xs font-semibold uppercase text-slate-500 tracking-wider"
          >
            Folders
          </h3>
          <ul class="mt-4 space-y-1">
            <li>
              <a
                href="#"
                class="block px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md text-sm"
                >Semua Aset</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md text-sm"
                >Tanpa Folder</a
              >
            </li>
            <li class="pt-4">
              <a
                href="#"
                class="block px-3 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-md text-sm"
                >Laporan Bulanan</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md text-sm"
                >Desain Produk</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md text-sm"
                >Materi Marketing</a
              >
            </li>
          </ul>
        </nav>

        <!-- Galeri Aset -->
        <div
          class="flex-1 bg-white p-4 rounded-lg border border-slate-200 overflow-y-auto"
        >
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <!-- Aset Item (Selected) -->
            <div
              class="relative group aspect-square rounded-lg ring-2 ring-offset-2 ring-indigo-600 cursor-pointer"
            >
              <img
                src="https://placehold.co/300x300/e0e7ff/4f46e5?text=Banner"
                alt="Asset preview"
                class="w-full h-full object-cover rounded-lg"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-50 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                <p class="text-white text-xs font-medium truncate">
                  hero-banner-v2.png
                </p>
              </div>
            </div>
            <!-- Aset Item -->
            <div
              class="relative group aspect-square rounded-lg bg-slate-100 border border-slate-200 cursor-pointer"
            >
              <div class="flex items-center justify-center h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 text-slate-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                class="absolute inset-0 bg-black bg-opacity-50 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                <p class="text-white text-xs font-medium truncate">
                  q3-report.pdf
                </p>
              </div>
            </div>
            <!-- Aset Item -->
            <div class="relative group aspect-square rounded-lg cursor-pointer">
              <img
                src="https://placehold.co/300x300/f3e8ff/8b5cf6?text=Logo"
                alt="Asset preview"
                class="w-full h-full object-cover rounded-lg"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-50 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                <p class="text-white text-xs font-medium truncate">
                  final-logo.svg
                </p>
              </div>
            </div>
            <!-- Aset Item -->
            <div
              class="relative group aspect-square rounded-lg bg-slate-100 border border-slate-200 cursor-pointer"
            >
              <div class="flex items-center justify-center h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 text-slate-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M18 3a1 1 0 00-1.196-.98l-15 2A1 1 0 003 5v11.591A.998.998 0 004.28 17.43L18 14.067V3zM4 6.278l13-1.733v9.043l-13 2.59V6.278z"
                  />
                  <path
                    d="M6 10a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </div>
              <div
                class="absolute inset-0 bg-black bg-opacity-50 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                <p class="text-white text-xs font-medium truncate">
                  background-music.mp3
                </p>
              </div>
            </div>
            <!-- Tambahkan lebih banyak item aset di sini -->
            <div class="aspect-square bg-slate-100 rounded-lg" />
            <div class="aspect-square bg-slate-100 rounded-lg" />
            <div class="aspect-square bg-slate-100 rounded-lg" />
            <div class="aspect-square bg-slate-100 rounded-lg" />
            <div class="aspect-square bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- Panel Detail Aset (kanan) -->
    <aside
      class="w-96 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-y-auto"
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold text-slate-900">Detail Aset</h3>
        <div class="mt-4 aspect-video rounded-lg bg-slate-100 overflow-hidden">
          <img
            src="https://placehold.co/400x225/e0e7ff/4f46e5?text=Banner"
            alt="Asset preview"
            class="w-full h-full object-contain"
          />
        </div>
      </div>
      <div class="flex-1 px-6 pb-6 space-y-4">
        <h4
          class="text-xs font-semibold uppercase text-slate-500 tracking-wider"
        >
          Informasi
        </h4>
        <dl class="space-y-3 text-sm">
          <div class="flex justify-between">
            <dt class="text-slate-500">Nama</dt>
            <dd class="font-medium text-slate-800 text-right">
              hero-banner-v2.png
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">Slug</dt>
            <dd class="font-medium text-slate-800 text-right">
              hero-banner-v2
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">Tipe Aset</dt>
            <dd class="font-medium text-slate-800">Image</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">Ukuran</dt>
            <dd class="font-medium text-slate-800">1.2 MB</dd>
          </div>
        </dl>

        <div class="pt-4">
          <label
            for="public-url"
            class="text-xs font-semibold uppercase text-slate-500 tracking-wider"
            >URL Publik</label
          >
          <div class="mt-2 relative">
            <input
              id="public-url"
              type="text"
              readonly
              value="/laporan-bulanan/hero-banner-v2"
              class="w-full bg-slate-100 border border-slate-200 rounded-md py-2 pl-3 pr-10 text-sm truncate"
            />
            <button
              class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-indigo-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="p-6 border-t border-slate-200 bg-white">
        <h4
          class="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-4"
        >
          Aksi
        </h4>
        <div class="grid grid-cols-2 gap-3">
          <button
            class="w-full text-center bg-white border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            Edit
          </button>
          <button
            class="w-full text-center bg-red-50 border border-red-200 text-red-700 font-semibold px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
          >
            Hapus
          </button>
        </div>
      </div>
    </aside>
  </main>
</template>
