# 🛡️ Middleware & Logic — Sesi 6

## Requirements

- Sudah selesai **Sesi 5** (Laravel di `api/`, API `/api/posts`, React sudah fetch ke backend).
- PHP & Composer terinstall (cek: `php -v` dan `composer -V`).

> 🎯 **Target Sesi 6:** paham **Data Validation** (Form Request), **Middleware** (auth token + logging),
> dan cara FE menyesuaikan diri: simpan token, kirim header, tampilkan error validasi.

---

## 🗺️ Alur Sesi Ini

| Bagian | Ngapain | File |
|---|---|---|
| **1 — Validation** | Pindahkan aturan validasi dari controller ke Form Request | `app/Http/Requests/*` |
| **2 — Middleware** | Bikin "satpam" di depan controller | `app/Http/Middleware/*`, `bootstrap/app.php` |
| **3 — Implementasi FE** | Token di localStorage, header `Authorization`, error di form | `src/api.js`, `src/App.jsx`, `PostComposer.jsx` |

---

# 1️⃣ Data Validation — Form Request

Di sesi 5, validasi ditulis langsung di controller:

```php
$data = $request->validate([
    'content' => ['required', 'string', 'max:280'],
]);
```

Masalahnya: controller jadi gemuk, dan pesan error-nya bahasa Inggris bawaan Laravel.
Solusinya **Form Request**: satu class khusus untuk satu "form".

```bash
php artisan make:request StorePostRequest
```

```php
class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;   // hanya user login yang boleh
    }

    public function rules(): array
    {
        return ['content' => ['required', 'string', 'max:280']];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'Post tidak boleh kosong.',
            'content.max'      => 'Post maksimal :max karakter.',
        ];
    }

    // Jalan SEBELUM rules(): rapikan input dulu
    protected function prepareForValidation(): void
    {
        $this->merge(['content' => trim((string) $this->input('content'))]);
    }
}
```

Lalu di controller tinggal ganti tipe parameternya:

```php
public function store(StorePostRequest $request)
{
    $post = $request->user()->posts()->create($request->validated());
    return response()->json(compact('post'), 201);
}
```

Kalau validasi gagal, Laravel **otomatis** balas `422`:

```json
{ "message": "Post maksimal 280 karakter.", "errors": { "content": ["Post maksimal 280 karakter."] } }
```

> 💡 Lihat juga `LoginRequest` dan `ReactRequest`. `ReactRequest` pakai `Rule::in([...])`
> supaya nilai yang boleh diambil dari konstanta di model, bukan string lepas.

---

# 2️⃣ Middleware

**Middleware = satpam.** Request masuk → middleware cek → kalau lolos, baru masuk controller.

```
Request ──▶ [LogApiRequest] ──▶ [auth.token] ──▶ Controller ──▶ Response
```

## 2a. `AuthenticateApiToken` (middleware "before")

```bash
php artisan make:middleware AuthenticateApiToken
```

```php
public function handle(Request $request, Closure $next): Response
{
    $token = $request->bearerToken();                       // dari header Authorization: Bearer xxx
    $user  = $token ? User::where('api_token', $token)->first() : null;

    if (! $user) {
        return response()->json(['message' => 'Kamu belum login atau token tidak valid.'], 401);
    }

    $request->setUserResolver(fn () => $user);              // supaya $request->user() jalan di controller
    return $next($request);                                 // lanjut ke controller
}
```

## 2b. `LogApiRequest` (middleware "after")

Membiarkan request lewat dulu, lalu mencatat hasilnya ke `storage/logs/laravel.log`:

```php
$response = $next($request);
Log::info('API request', ['method' => ..., 'path' => ..., 'status' => $response->getStatusCode()]);
return $response;
```

## 2c. Daftarkan di `bootstrap/app.php`

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias(['auth.token' => AuthenticateApiToken::class]);   // nama pendek
    $middleware->api(append: [LogApiRequest::class]);                     // semua route api/*
})
```

## 2d. Pakai di `routes/api.php`

```php
Route::post('/login', [AuthController::class, 'login']);          // publik

Route::middleware('auth.token')->group(function () {              // wajib token
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/posts',   [PostController::class, 'index']);
    Route::post('/posts',  [PostController::class, 'store']);
    Route::post('/posts/{post}/react', [ReactionController::class, 'react']);
});
```

## 2e. Dari mana tokennya?

Migration baru menambah kolom `api_token` ke tabel `users` (contoh **alter table**, data lama aman):

```bash
php artisan make:migration add_api_token_to_users_table --table=users
php artisan migrate
```

Saat login berhasil, `AuthController` membuat token acak dan menyimpannya:

```php
$token = Str::random(60);
$user->update(['api_token' => $token]);
return response()->json(compact('user', 'token'));
```

> 🔒 `api_token` masuk `#[Hidden]` di model `User`, jadi tidak pernah ikut bocor di JSON `user`.

---

# 3️⃣ Implementasi di React

| Sesi 5 | Sesi 6 |
|---|---|
| Login → dapat `user` | Login → dapat `user` **+ `token`**, token disimpan ke `localStorage` |
| Kirim `user_id` di body / query | Tidak perlu. Kirim header `Authorization: Bearer <token>` |
| Refresh → harus login lagi | Refresh → cek `GET /api/me`, kalau valid langsung masuk |
| Error validasi → `alert()` | Error validasi tampil **di bawah textarea** |

Inti perubahannya ada di `src/api.js`:

```js
const token = getToken();
if (token) headers.Authorization = `Bearer ${token}`;

if (!res.ok) throw new ApiError(res.status, data);   // err.status, err.message, err.errors
```

Dan di `App.jsx`, kalau backend balas **401** (ditolak middleware), FE otomatis logout:

```js
function handleApiError(err) {
  if (err.status === 401) { api.setToken(null); setCurrentUser(null); setPage("login"); return; }
  alert(err.message);
}
```

---

## 🧪 Coba Sendiri (curl)

```bash
# 1. tanpa token → 401
curl -s localhost:8000/api/posts -H 'Accept: application/json'

# 2. login → simpan token
curl -s -X POST localhost:8000/api/login -H 'Content-Type: application/json' \
  -d '{"username":"calista","password":"123456"}'

# 3. post kosong → 422 dengan pesan Indonesia
curl -s -X POST localhost:8000/api/posts -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN>' -d '{"content":"   "}'

# 4. lihat log middleware
tail storage/logs/laravel.log
```

---

## 🎁 Bonus

- Coba tambahkan rule `unique:posts,content` ke `StorePostRequest`. Apa yang terjadi kalau post yang sama dikirim dua kali?
- Bikin middleware `EnsureIsOwner` yang hanya mengizinkan penulis post menghapus post-nya sendiri. Butuh route `DELETE /api/posts/{post}` dulu.
- Di produksi, token biasanya di-*hash* sebelum disimpan dan punya masa berlaku. Cari tahu tentang **Laravel Sanctum**.
