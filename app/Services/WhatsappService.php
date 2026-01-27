<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    public function send($phone, $message)
    {
        $apiKey = config('whatsapp.api_key');

        $url = "https://api.callmebot.com/whatsapp.php";
        
        $response = Http::get($url, [
            'phone' => $phone,
            'text'  => $message,
            'apikey'=> $apiKey
        ]);

        Log::info('WhatsApp API Response', ['response' => $response->body()]);

        return $response->successful();
    }
}
