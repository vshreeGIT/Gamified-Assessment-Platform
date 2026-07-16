package com.skillquest.service;

import com.skillquest.dto.LoginRequest;
import com.skillquest.dto.LoginResponse;
import com.skillquest.dto.RegisterRequest;

public interface UserService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

}