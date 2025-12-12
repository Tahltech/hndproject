<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RabbitMaidService
{
    protected $baseUrl = 'https://api.rabbitmaid.com/v1/';

    public function transact($service, $type, $amount)
    {
        $response = Http::withHeaders([
            'application-key' => env('RABBIT_APPLICATION_KEY'),
            'access-key' => env('RABBIT_ACCESS_KEY'),
            'secret-key' => env('RABBIT_SECRET_KEY'),
        ])->post($this->baseUrl . 'wallets/transaction', [
            'service' => $service,
            'type' => $type,
            'amount' => $amount,
        ]);

        return $response->successful()
            ? $response->json()
            : ['error' => $response->json()];
    }
}
