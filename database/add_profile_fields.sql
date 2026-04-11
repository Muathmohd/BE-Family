-- Add profile fields to user table

ALTER TABLE `user`
ADD COLUMN `birthday` DATE DEFAULT NULL AFTER `mobile`,
ADD COLUMN `status` ENUM('طالب','موظف','غير موظف','اخرى') DEFAULT NULL AFTER `birthday`,
ADD COLUMN `living` ENUM('الدمام','الخبر','الرياض','الاحساء','جده','المدينة','مكة','اخرى','الجبيل') DEFAULT NULL AFTER `status`;
