package com.classroom.platform.security;

import com.classroom.platform.users.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class UserPrincipal implements UserDetails {

    private final UUID id;
    private final UUID institutionId;
    private final String email;
    private final String password;
    private final String displayName;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(UUID id, UUID institutionId, String email, String password,
                         String displayName, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.institutionId = institutionId;
        this.email = email;
        this.password = password;
        this.displayName = displayName;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getSystemRole())
        );

        return new UserPrincipal(
                user.getId(),
                user.getInstitution() != null ? user.getInstitution().getId() : null,
                user.getEmail(),
                user.getPasswordHash(),
                user.getDisplayName(),
                authorities
        );
    }

    public UUID getId() { return id; }
    public UUID getInstitutionId() { return institutionId; }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
