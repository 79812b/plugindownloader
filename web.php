<?php

use Illuminate\Support\Facades\Route;
use Pterodactyl\Plugins\PluginDownloader\Http\Controllers\PluginDownloaderController;

Route::get('/plugin-downloader', [PluginDownloaderController::class, 'index'])->name('plugin-downloader.index');
Route::get('/api/plugins/search', [PluginDownloaderController::class, 'search'])->name('plugin-downloader.search');
Route::get('/api/plugins/versions', [PluginDownloaderController::class, 'versions'])->name('plugin-downloader.versions');
Route::get('/api/plugins/download', [PluginDownloaderController::class, 'download'])->name('plugin-downloader.download');
