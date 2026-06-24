<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Login the admin user.
     */
    public function login(LoginRequest $request): \Illuminate\Http\JsonResponse
    {
        $credentials = $request->validated();
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return $this->failed('Invalid credentials', null, 401);
        }

        $token = $user->createToken('hrms-admin')->plainTextToken;

        return $this->success('Login successful', [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'token' => $token,
        ]);
    }

    /**
     * Logout the admin user.
     */
    public function logout(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return $this->success('Logout successful');
    }

    /**
     * Get the authenticated user.
     */
    public function user(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();

        return $this->success('User retrieved', [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }
}
