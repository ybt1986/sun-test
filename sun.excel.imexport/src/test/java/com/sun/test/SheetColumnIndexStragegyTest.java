package com.sun.test;

import org.junit.Test;

import com.sun.excel.SheetColumnFieldCfg;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar.FillingSheetColumnIndexStrategy;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar.SequenceSheetColumnIndexStrategy;
import com.sun.excel.common.SheetColumnIndexStrategyRegistrar.SheetColumnIndexStrategy;

public class SheetColumnIndexStragegyTest {
	@Test
	public void test01() {
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

		SheetColumnIndexStrategy columnIndexStrategy = new SequenceSheetColumnIndexStrategy();
		System.out.println(columnIndexStrategy.findColumnIndex(columnField1, 0, 6));
		System.out.println(columnIndexStrategy.findColumnIndex(columnField2, 1, 6));
		System.out.println(columnIndexStrategy.findColumnIndex(columnField3, 2, 6));
		System.out.println(columnIndexStrategy.findColumnIndex(columnField4, 3, 6));
		System.out.println(columnIndexStrategy.findColumnIndex(columnField5, 4, 6));
		System.out.println(columnIndexStrategy.findColumnIndex(columnField6, 5, 6));
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
		System.out.println(columnIndexStrategy.findColumnIndex(columnField1, 0, 6)); // 0
		System.out.println(columnIndexStrategy.findColumnIndex(columnField2, 1, 6)); // 3
		System.out.println(columnIndexStrategy.findColumnIndex(columnField3, 2, 6)); // 1
		System.out.println(columnIndexStrategy.findColumnIndex(columnField4, 3, 6)); // 5
		System.out.println(columnIndexStrategy.findColumnIndex(columnField5, 4, 6)); // 2
		System.out.println(columnIndexStrategy.findColumnIndex(columnField6, 5, 6)); // 4
	}
}
