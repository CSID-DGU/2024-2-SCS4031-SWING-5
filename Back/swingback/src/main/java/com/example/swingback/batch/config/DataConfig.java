package com.example.swingback.batch.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
@EnableJpaRepositories(
        basePackages = {
                "com.example.swingback.calendar.repository",
                "com.example.swingback.family.newcode.repository",
                "com.example.swingback.medicine.medicationmanagement.repository",
                "com.example.swingback.medicine.medicinebag.repository",
                "com.example.swingback.medicine.medicineinput.repository",
                "com.example.swingback.notification.message.repository",
                "com.example.swingback.notification.token.repository",
                "com.example.swingback.notification.total.repository",
                "com.example.swingback.User.repository",
                "com.example.swingback.healthcare.healthinfo.repository",
                "com.example.swingback.chat.repository",
                "com.example.swingback.healthcare.notificationtime.repository",
                "com.example.swingback.reward.repository",
                "com.example.swingback.medicine.medicinedata.repository"

        },
        entityManagerFactoryRef = "dataEntityManager",
        transactionManagerRef = "dataTransactionManager"
)
public class DataConfig {
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.primary")
    public DataSource dataDBSource() {

        return DataSourceBuilder.create().build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean dataEntityManager() {

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();

        em.setDataSource(dataDBSource());
        em.setPackagesToScan(new String[]{
                "com.example.swingback.calendar.entity",
                "com.example.swingback.family.newcode.entity",
                "com.example.swingback.medicine.medicationmanagement.entity",
                "com.example.swingback.medicine.medicinebag.entity",
                "com.example.swingback.medicine.medicineinput.entity",
                "com.example.swingback.notification.message.entity",
                "com.example.swingback.notification.token.entity",
                "com.example.swingback.notification.total.entity",
                "com.example.swingback.User.entity",
                "com.example.swingback.healthcare.healthinfo.entity",
                "com.example.swingback.chat.entity",
                "com.example.swingback.healthcare.notificationtime.entity",
                "com.example.swingback.reward.entity",
                "com.example.swingback.medicine.medicinedata.entity"
        });
        em. setJpaVendorAdapter(new HibernateJpaVendorAdapter());

        // 동일한 JPA 속성 설정
        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.show_sql", "true");
        em.setJpaPropertyMap(properties);

        return em;
    }

    @Bean
    public PlatformTransactionManager dataTransactionManager() {

        JpaTransactionManager transactionManager = new JpaTransactionManager();

        transactionManager.setEntityManagerFactory(dataEntityManager().getObject());

        return transactionManager;
    }
}
