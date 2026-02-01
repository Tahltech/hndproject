<?php

return [

    /*
    |--------------------------------------------------------------------------
    | RabbitMaid API Configuration
    |--------------------------------------------------------------------------
    |
    | All RabbitMaid credentials and base URL are configured here. You can
    | set the actual values in your .env file.
    |
    */

    'base_url' => env('RABBITMAID_BASE_URL', 'https://api.rabbitmaid.com/v1/'),

    'application_key' => env('RABBITMAID_APPLICATION_KEY', ''),

    'access_key' => env('RABBITMAID_ACCESS_KEY', ''),

    'secret_key' => env('RABBITMAID_SECRET_KEY', ''),

];
