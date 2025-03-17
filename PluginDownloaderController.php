<?php

namespace Pterodactyl\Plugins\PluginDownloader\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class PluginDownloaderController
{
    private $spigetApiUrl = "https://api.spiget.org/v2";

    public function index()
    {
        return view('PluginDownloader::plugin-downloader');
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        $response = Http::get("$this->spigetApiUrl/search/resources/$query?field=name&size=10");
        if ($response->failed()) {
            return response()->json(['error' => 'Failed to fetch plugins.'], 500);
        }
        return response()->json(['plugins' => $response->json()]);
    }

    public function versions(Request $request)
    {
        $pluginId = $request->input('id');
        $response = Http::get("$this->spigetApiUrl/resources/$pluginId/versions");
        if ($response->failed()) {
            return response()->json(['error' => 'Failed to fetch versions.'], 500);
        }
        return response()->json(['versions' => $response->json()]);
    }

    public function download(Request $request)
    {
        $versionId = $request->input('id');
        $response = Http::get("$this->spigetApiUrl/resources/versions/$versionId/download");
        if ($response->failed()) {
            return response()->json(['error' => 'Failed to download plugin.'], 500);
        }
        $pluginName = "plugin-$versionId.jar";
        Storage::disk('plugins')->put($pluginName, $response->body());
        return response()->json(['success' => true]);
    }
}
