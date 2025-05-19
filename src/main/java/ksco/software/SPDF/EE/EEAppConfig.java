package ksco.software.SPDF.EE;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import lombok.extern.slf4j.Slf4j;

import ksco.software.SPDF.model.ApplicationProperties;
import ksco.software.SPDF.model.ApplicationProperties.Premium.ProFeatures.GoogleDrive;

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class EEAppConfig {

    private final ApplicationProperties applicationProperties;

    public EEAppConfig(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;

        // Enable all premium features
        applicationProperties.getPremium().setEnabled(true);
        applicationProperties.getPremium().setMaxUsers(Integer.MAX_VALUE);

        // Enable all pro features
        var proFeatures = applicationProperties.getPremium().getProFeatures();
        proFeatures.setSsoAutoLogin(true);
        proFeatures.getGoogleDrive().setEnabled(true);
    }

    @Bean(name = "runningProOrHigher")
    public boolean runningProOrHigher() {
        return true;
    }

    @Bean(name = "license")
    public String licenseType() {
        return "ENTERPRISE";
    }

    @Bean(name = "runningEE")
    public boolean runningEnterprise() {
        return true;
    }

    @Bean(name = "SSOAutoLogin")
    public boolean ssoAutoLogin() {
        return true;
    }

    @Bean(name = "GoogleDriveEnabled")
    public boolean googleDriveEnabled() {
        return true;
    }

    @Bean(name = "GoogleDriveConfig")
    public GoogleDrive googleDriveConfig() {
        return applicationProperties.getPremium().getProFeatures().getGoogleDrive();
    }
}
