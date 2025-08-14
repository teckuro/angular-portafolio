# Laravel API Documentation para Panel de Administración

## Configuración Inicial

### 1. Instalación de Laravel

```bash
composer create-project laravel/laravel portfolio-api
cd portfolio-api
```

### 2. Configuración de Base de Datos

```bash
# Configurar .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portfolio_db
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Instalación de Paquetes Necesarios

```bash
composer require laravel/sanctum
composer require spatie/laravel-permission
```

## Estructura de Base de Datos

### Migraciones

#### 1. Tabla de Administradores

```php
// database/migrations/2024_01_01_000001_create_admin_users_table.php
public function up()
{
    Schema::create('admin_users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->string('password');
        $table->enum('role', ['admin', 'super_admin'])->default('admin');
        $table->rememberToken();
        $table->timestamps();
    });
}
```

#### 2. Tabla de Proyectos

```php
// database/migrations/2024_01_01_000002_create_projects_table.php
public function up()
{
    Schema::create('projects', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description');
        $table->string('date');
        $table->json('tech');
        $table->string('image');
        $table->string('demo_link')->nullable();
        $table->string('code_link')->nullable();
        $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
        $table->boolean('featured')->default(false);
        $table->timestamps();
    });
}
```

#### 3. Tabla de Experiencia Laboral

```php
// database/migrations/2024_01_01_000003_create_works_table.php
public function up()
{
    Schema::create('works', function (Blueprint $table) {
        $table->id();
        $table->string('company');
        $table->string('position');
        $table->text('description');
        $table->string('start_date');
        $table->string('end_date')->nullable();
        $table->string('location');
        $table->json('tech');
        $table->json('achievements');
        $table->boolean('is_current')->default(false);
        $table->string('company_url')->nullable();
        $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
        $table->timestamps();
    });
}
```

## Modelos

### 1. AdminUser Model

```php
// app/Models/AdminUser.php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class AdminUser extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
```

### 2. Project Model

```php
// app/Models/Project.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'date',
        'tech',
        'image',
        'demo_link',
        'code_link',
        'status',
        'featured',
    ];

    protected $casts = [
        'tech' => 'array',
        'featured' => 'boolean',
    ];
}
```

### 3. Work Model

```php
// app/Models/Work.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $fillable = [
        'company',
        'position',
        'description',
        'start_date',
        'end_date',
        'location',
        'tech',
        'achievements',
        'is_current',
        'company_url',
        'status',
    ];

    protected $casts = [
        'tech' => 'array',
        'achievements' => 'array',
        'is_current' => 'boolean',
    ];
}
```

## Controladores

### 1. AdminAuthController

```php
// app/Http/Controllers/Api/Admin/AuthController.php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = AdminUser::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'expires_at' => now()->addDays(30)->toISOString(),
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admin_users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = AdminUser::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'expires_at' => now()->addDays(30)->toISOString(),
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }
}
```

### 2. AdminProjectController

```php
// app/Http/Controllers/Api/Admin/ProjectController.php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query();

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('featured')) {
            $query->where('featured', $request->boolean('featured'));
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        $projects = $query->paginate($request->get('per_page', 15));

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|string',
            'tech' => 'required|array',
            'image' => 'required|string',
            'demo_link' => 'nullable|url',
            'code_link' => 'nullable|url',
            'status' => 'required|in:active,inactive,draft',
            'featured' => 'boolean',
        ]);

        $project = Project::create($request->all());

        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'date' => 'sometimes|required|string',
            'tech' => 'sometimes|required|array',
            'image' => 'sometimes|required|string',
            'demo_link' => 'nullable|url',
            'code_link' => 'nullable|url',
            'status' => 'sometimes|required|in:active,inactive,draft',
            'featured' => 'sometimes|boolean',
        ]);

        $project->update($request->all());

        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json(['message' => 'Proyecto eliminado exitosamente']);
    }

    public function toggleStatus(Request $request, Project $project)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,draft',
        ]);

        $project->update(['status' => $request->status]);

        return response()->json($project);
    }

    public function toggleFeatured(Request $request, Project $project)
    {
        $request->validate([
            'featured' => 'required|boolean',
        ]);

        $project->update(['featured' => $request->featured]);

        return response()->json($project);
    }

    public function uploadImage(Request $request, Project $project)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $path = $request->file('image')->store('projects', 'public');

        return response()->json([
            'image_url' => Storage::url($path),
        ]);
    }

    public function stats()
    {
        $stats = [
            'total' => Project::count(),
            'active' => Project::where('status', 'active')->count(),
            'inactive' => Project::where('status', 'inactive')->count(),
            'draft' => Project::where('status', 'draft')->count(),
            'featured' => Project::where('featured', true)->count(),
        ];

        return response()->json($stats);
    }
}
```

### 3. AdminWorkController

```php
// app/Http/Controllers/Api/Admin/WorkController.php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    public function index(Request $request)
    {
        $query = Work::query();

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('is_current')) {
            $query->where('is_current', $request->boolean('is_current'));
        }

        if ($request->has('search')) {
            $query->where('company', 'like', '%' . $request->search . '%')
                  ->orWhere('position', 'like', '%' . $request->search . '%');
        }

        $works = $query->paginate($request->get('per_page', 15));

        return response()->json($works);
    }

    public function store(Request $request)
    {
        $request->validate([
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|string',
            'end_date' => 'nullable|string',
            'location' => 'required|string',
            'tech' => 'required|array',
            'achievements' => 'required|array',
            'is_current' => 'boolean',
            'company_url' => 'nullable|url',
            'status' => 'required|in:active,inactive,draft',
        ]);

        $work = Work::create($request->all());

        return response()->json($work, 201);
    }

    public function show(Work $work)
    {
        return response()->json($work);
    }

    public function update(Request $request, Work $work)
    {
        $request->validate([
            'company' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'start_date' => 'sometimes|required|string',
            'end_date' => 'nullable|string',
            'location' => 'sometimes|required|string',
            'tech' => 'sometimes|required|array',
            'achievements' => 'sometimes|required|array',
            'is_current' => 'sometimes|boolean',
            'company_url' => 'nullable|url',
            'status' => 'sometimes|required|in:active,inactive,draft',
        ]);

        $work->update($request->all());

        return response()->json($work);
    }

    public function destroy(Work $work)
    {
        $work->delete();

        return response()->json(['message' => 'Experiencia laboral eliminada exitosamente']);
    }

    public function toggleStatus(Request $request, Work $work)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,draft',
        ]);

        $work->update(['status' => $request->status]);

        return response()->json($work);
    }

    public function toggleCurrent(Request $request, Work $work)
    {
        $request->validate([
            'is_current' => 'required|boolean',
        ]);

        $work->update(['is_current' => $request->is_current]);

        return response()->json($work);
    }

    public function stats()
    {
        $stats = [
            'total' => Work::count(),
            'active' => Work::where('status', 'active')->count(),
            'inactive' => Work::where('status', 'inactive')->count(),
            'draft' => Work::where('status', 'draft')->count(),
            'current' => Work::where('is_current', true)->count(),
        ];

        return response()->json($stats);
    }

    public function byCompany($company)
    {
        $works = Work::where('company', 'like', '%' . $company . '%')->get();

        return response()->json($works);
    }

    public function byTech($tech)
    {
        $works = Work::whereJsonContains('tech', $tech)->get();

        return response()->json($works);
    }
}
```

## Rutas API

```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\Admin\WorkController;

// Rutas públicas de autenticación
Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Rutas protegidas de administración
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Proyectos
    Route::apiResource('projects', ProjectController::class);
    Route::patch('projects/{project}/status', [ProjectController::class, 'toggleStatus']);
    Route::patch('projects/{project}/featured', [ProjectController::class, 'toggleFeatured']);
    Route::post('projects/{project}/image', [ProjectController::class, 'uploadImage']);
    Route::get('projects/stats', [ProjectController::class, 'stats']);

    // Experiencia Laboral
    Route::apiResource('works', WorkController::class);
    Route::patch('works/{work}/status', [WorkController::class, 'toggleStatus']);
    Route::patch('works/{work}/current', [WorkController::class, 'toggleCurrent']);
    Route::get('works/stats', [WorkController::class, 'stats']);
    Route::get('works/company/{company}', [WorkController::class, 'byCompany']);
    Route::get('works/tech/{tech}', [WorkController::class, 'byTech']);
});
```

## Middleware de CORS

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:4200'], // URL de tu aplicación Angular
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

## Configuración de Sanctum

```php
// config/sanctum.php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),
    'guard' => ['web'],
    'expiration' => null,
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];
```

## Seeders para Datos de Prueba

```php
// database/seeders/AdminUserSeeder.php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        AdminUser::create([
            'name' => 'Administrador',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
        ]);
    }
}
```

## Comandos de Ejecución

```bash
# Ejecutar migraciones
php artisan migrate

# Ejecutar seeders
php artisan db:seed --class=AdminUserSeeder

# Crear enlace simbólico para storage
php artisan storage:link

# Iniciar servidor
php artisan serve
```

## Endpoints de la API

### Autenticación

- `POST /api/admin/login` - Iniciar sesión
- `POST /api/admin/register` - Registro de administrador
- `POST /api/admin/logout` - Cerrar sesión
- `GET /api/admin/profile` - Obtener perfil

### Proyectos

- `GET /api/admin/projects` - Listar proyectos
- `POST /api/admin/projects` - Crear proyecto
- `GET /api/admin/projects/{id}` - Obtener proyecto
- `PUT /api/admin/projects/{id}` - Actualizar proyecto
- `DELETE /api/admin/projects/{id}` - Eliminar proyecto
- `PATCH /api/admin/projects/{id}/status` - Cambiar estado
- `PATCH /api/admin/projects/{id}/featured` - Cambiar destacado
- `POST /api/admin/projects/{id}/image` - Subir imagen
- `GET /api/admin/projects/stats` - Estadísticas

### Experiencia Laboral

- `GET /api/admin/works` - Listar experiencias
- `POST /api/admin/works` - Crear experiencia
- `GET /api/admin/works/{id}` - Obtener experiencia
- `PUT /api/admin/works/{id}` - Actualizar experiencia
- `DELETE /api/admin/works/{id}` - Eliminar experiencia
- `PATCH /api/admin/works/{id}/status` - Cambiar estado
- `PATCH /api/admin/works/{id}/current` - Cambiar actual
- `GET /api/admin/works/stats` - Estadísticas
- `GET /api/admin/works/company/{company}` - Por empresa
- `GET /api/admin/works/tech/{tech}` - Por tecnología

## Notas Importantes

1. **CORS**: Configurar correctamente los dominios permitidos en `config/cors.php`
2. **Autenticación**: Usar Sanctum para autenticación API
3. **Validación**: Implementar validación robusta en todos los endpoints
4. **Seguridad**: Usar HTTPS en producción
5. **Backup**: Implementar respaldos regulares de la base de datos
6. **Logs**: Configurar logging para auditoría
7. **Rate Limiting**: Implementar límites de tasa para prevenir abuso
