package com.skillquest.service;

import com.skillquest.dto.LoginRequest;
import com.skillquest.dto.LoginResponse;
import com.skillquest.dto.RegisterRequest;
import com.skillquest.dto.UpdateProfileRequest;
import com.skillquest.dto.UserProfileResponse;
import com.skillquest.dto.AuthUserDto;

public interface UserService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    UserProfileResponse getProfile(String email);

    AuthUserDto getAuthenticatedUser(String email);

    UserProfileResponse updateProfile(String email, UpdateProfileRequest request);

}
