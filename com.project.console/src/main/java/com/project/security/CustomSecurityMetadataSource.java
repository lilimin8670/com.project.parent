package com.project.security;

import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;

import java.util.*;

public class CustomSecurityMetadataSource implements FilterInvocationSecurityMetadataSource {

    private Map<String, List<ConfigAttribute>> resources;

    public CustomSecurityMetadataSource() {
        loadAuthorityResources();
    }

    private void loadAuthorityResources() {
        // 此处在创建时从数据库中初始化权限数据
        // 将权限与资源数据整理成 Map<resource, List<Authority>> 的形式
        // 注意：加载URL资源时，需要对资源进行排序，要由精确到粗略进行排序，让精确的URL优先匹配
        resources = new HashMap<String, List<ConfigAttribute>>();

        // 此处先伪造一些数据
        List<ConfigAttribute> authorityList = new ArrayList<ConfigAttribute>();
        ConfigAttribute auth = new SecurityConfig("AUTH_WELCOME");
        authorityList.add(auth);
        resources.put("/welcome", authorityList);
    }

    public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {
        String url = ((FilterInvocation) object).getRequestUrl();

        Set<String> keys = resources.keySet();

        for (String k : keys) {
            if (url.indexOf(k) >= 0) {
                return resources.get(k);
            }
        }
        return null;
    }

    public Collection<ConfigAttribute> getAllConfigAttributes() {
        return null;
    }

    public boolean supports(Class<?> clazz) {
        return false;
    }
}
