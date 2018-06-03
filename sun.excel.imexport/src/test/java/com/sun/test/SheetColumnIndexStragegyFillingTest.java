package com.sun.test;

import org.junit.Assert;
import org.junit.Test;

import com.sun.excel.SheetColumnFieldCfg;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar.FillingSheetColumnIndexStrategy;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar.SheetColumnIndexStrategy;

public class SheetColumnIndexStragegyFillingTest {
	@Test
	public void test01() {
		SheetColumnFieldCfg columnField1 = new SheetColumnFieldCfg();
		columnField1.setColumnIndex(-1);

		SheetColumnFieldCfg columnField2 = new SheetColumnFieldCfg();
		columnField2.setColumnIndex(-1);

		SheetColumnFieldCfg columnField3 = new SheetColumnFieldCfg();
		columnField3.setColumnIndex(-1);

		SheetColumnFieldCfg columnField4 = new SheetColumnFieldCfg();
		columnField4.setColumnIndex(-1);

		SheetColumnFieldCfg columnField5 = new SheetColumnFieldCfg();
		columnField5.setColumnIndex(-1);

		SheetColumnFieldCfg columnField6 = new SheetColumnFieldCfg();
		columnField6.setColumnIndex(-1);

		SheetColumnIndexStrategy columnIndexStrategy = new FillingSheetColumnIndexStrategy();
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField1, 0, 6), 0);
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField2, 1, 6), 1);
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField3, 2, 6), 2);
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField4, 3, 6), 3);
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField5, 4, 6), 4);
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField6, 5, 6), 5);
	}

	@Test
	public void test02() {
		SheetColumnFieldCfg columnField1 = new SheetColumnFieldCfg();
		columnField1.setColumnIndex(-1);

		SheetColumnFieldCfg columnField2 = new SheetColumnFieldCfg();
		columnField2.setColumnIndex(3);

		SheetColumnFieldCfg columnField3 = new SheetColumnFieldCfg();
		columnField3.setColumnIndex(-1);

		SheetColumnFieldCfg columnField4 = new SheetColumnFieldCfg();
		columnField4.setColumnIndex(5);

		SheetColumnFieldCfg columnField5 = new SheetColumnFieldCfg();
		columnField5.setColumnIndex(0);

		SheetColumnFieldCfg columnField6 = new SheetColumnFieldCfg();
		columnField6.setColumnIndex(-1);

		SheetColumnIndexStrategy columnIndexStrategy = new FillingSheetColumnIndexStrategy();
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField1, 0, 6), 0); // 0
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField2, 1, 6), 3); // 3
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField3, 2, 6), 1); // 1
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField4, 3, 6), 5); // 5
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField5, 4, 6), 2); // 2
		Assert.assertEquals(columnIndexStrategy.findColumnIndex(columnField6, 5, 6), 4); // 4
	}
}
