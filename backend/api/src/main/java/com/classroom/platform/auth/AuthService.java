package com.classroom.platform.auth;

import com.classroom.platform.auth.dto.AuthResponse;
import com.classroom.platform.auth.dto.LoginRequest;
import com.classroom.platform.auth.dto.RegisterRequest;
import com.classroom.platform.common.ApiException;
import com.classroom.platform.institutions.Institution;
import com.classroom.platform.institutions.InstitutionRepository;
import com.classroom.platform.security.JwtTokenProvider;
import com.classroom.platform.security.UserPrincipal;
import com.classroom.platform.users.User;
import com.classroom.platform.users.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;

    public AuthService(UserRepository userRepository,
                       InstitutionRepository institutionRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       StringRedisTemplate redisTemplate) {
        this.userRepository = userRepository;
        this.institutionRepository = institutionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailAndDeletedAtIsNull(request.getEmail())) {
            throw new ApiException(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS", "A user with this email address already exists.");
        }

        Institution institution;
        if (request.getInstitutionSlug() != null) {
            institution = institutionRepository.findBySlug(request.getInstitutionSlug())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "INSTITUTION_NOT_FOUND", "Institution not found with slug: " + request.getInstitutionSlug()));
        } else {
            institution = institutionRepository.findBySlug("default")
                    .orElseGet(() -> institutionRepository.save(Institution.builder()
                            .name("Default Institution")
                            .slug("default")
                            .build()));
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName().trim())
                .institution(institution)
                .systemRole("USER")
                .mfaEnabled(false)
                .build();

        user = userRepository.save(user);

        return generateAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password.");
        }

        return generateAuthResponse(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(principal);
        String refreshToken = UUID.randomUUID().toString();

        try {
            redisTemplate.opsForValue().set(
                    "refresh_token:" + refreshToken,
                    user.getId().toString(),
                    Duration.ofDays(7)
            );
        } catch (Exception e) {
            log.warn("Redis is unavailable for refresh token storage; proceeding with stateless token: {}", e.getMessage());
        }

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getAccessTokenExpirationSeconds())
                .user(new AuthResponse.UserDto(user.getId(), user.getEmail(), user.getDisplayName(), user.getSystemRole()))
                .build();
    }
}
