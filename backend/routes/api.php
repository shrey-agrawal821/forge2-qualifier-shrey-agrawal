<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardListController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\MemberController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Boards CRUD
Route::apiResource('boards', BoardController::class);

// Lists CRUD
Route::post('boards/{board}/lists', [BoardListController::class, 'store']);
Route::apiResource('lists', BoardListController::class)->only(['update', 'destroy']);

// Cards CRUD
Route::post('lists/{list}/cards', [CardController::class, 'store']);
Route::apiResource('cards', CardController::class)->only(['update', 'destroy']);

// Card Tag Associations
Route::post('cards/{card}/tags', [CardController::class, 'attachTag']);
Route::delete('cards/{card}/tags/{tag}', [CardController::class, 'detachTag']);

// Card Member Assignments
Route::post('cards/{card}/members', [CardController::class, 'assignMember']);
Route::delete('cards/{card}/members/{member}', [CardController::class, 'removeMember']);

// Tags and Members catalogs
Route::apiResource('tags', TagController::class)->only(['index', 'store', 'destroy']);
Route::apiResource('members', MemberController::class)->only(['index', 'store', 'destroy']);
