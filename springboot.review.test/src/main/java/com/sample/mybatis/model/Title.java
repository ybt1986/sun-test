package com.sample.mybatis.model;

import java.util.Date;

public class Title extends TitleKey {
    private Date toDate;

    public Date getToDate() {
        return toDate;
    }

    public void setToDate(Date toDate) {
        this.toDate = toDate;
    }
}