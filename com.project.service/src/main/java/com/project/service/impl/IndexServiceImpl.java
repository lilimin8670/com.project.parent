package com.project.service.impl;

import com.project.dao.MemberMapper;
import com.project.service.IndexService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class IndexServiceImpl implements IndexService{

    @Resource
    private MemberMapper memberMapper;

    public int getName(){
        return memberMapper.getUserCount();
    }
}
