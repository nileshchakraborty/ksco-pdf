package ksco.software.SPDF.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class EnterpriseEndpointFilter extends OncePerRequestFilter {
    private final boolean runningProOrHigher = true; // Always return true

    public EnterpriseEndpointFilter(@Qualifier("runningProOrHigher") boolean runningProOrHigher) {
        // Ignore the injected value
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Allow all requests
        filterChain.doFilter(request, response);
    }

    private boolean isPrometheusEndpointRequest(HttpServletRequest request) {
        return false; // Always return false to allow all endpoints
    }
}
