<?php

return [
    'provider' => env('SMS_PROVIDER'),

    'termii' => [
        'api_key' => env('TERMII_API_KEY'),
        'sender_id' => env('TERMII_SENDER_ID'),
        'base_url' => env('TERMII_BASE_URL'),
    ],
];
