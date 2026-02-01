<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RabbitMaidService
{
    protected $baseUrl;
    protected $applicationKey;
    protected $accessKey;
    protected $secretKey;

    public function __construct()
    {
        $this->baseUrl = config('rabbitmaid.base_url');
        $this->applicationKey = config('rabbitmaid.application_key');
        $this->accessKey = config('rabbitmaid.access_key');
        $this->secretKey = config('rabbitmaid.secret_key');
    }

    public function transact($service, $type, $amount)
    {
        Log::info('RabbitMaid API request', [
            'service' => $service,
            'type' => $type,
            'amount' => $amount,
        ]);

        try {
            $response = Http::withHeaders([
                'application-key' => $this->applicationKey,
                'access-key' => $this->accessKey,
                'secret-key' => $this->secretKey,
            ])->post($this->baseUrl . 'wallets/transaction', [
                'service' => $service,
                'type' => $type,
                'amount' => $amount,
            ]);

            Log::info('RabbitMaid API response', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            return $response;
        } catch (\Throwable $e) {
            Log::error('RabbitMaid API error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'service' => $service,
                'type' => $type,
                'amount' => $amount,
            ]);

            throw $e;
        }
    }
}
