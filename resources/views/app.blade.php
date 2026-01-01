<!Doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="icon" type="image/png" href="{{ asset('Images/Tahlfin.png') }}">


  @viteReactRefresh
  @vite(['resources/js/app.jsx','resources/css/app.css'])
  @routes()
  @inertiaHead
   {{-- <meta name="csrf-token" content="{{ csrf_token() }}"> --}}
</head>
<body>
  @inertia
</body>
</html>
