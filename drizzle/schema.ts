import { boolean, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 手机号注册用户表
 * 支持手机号 + 密码登录，独立于 Manus OAuth 体系
 */
export const phoneUsers = pgTable("phone_users", {
  id: serial("id").primaryKey(),
  /** 手机号，唯一标识 */
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  /** 用户昵称 */
  nickname: varchar("nickname", { length: 64 }).notNull(),
  /** bcrypt 哈希后的密码 */
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  /** 用户角色 */
  role: roleEnum("role").default("user").notNull(),
  /** 注册时使用的邀请码 */
  inviteCode: varchar("inviteCode", { length: 32 }),
  /** 是否已激活 */
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type PhoneUser = typeof phoneUsers.$inferSelect;
export type InsertPhoneUser = typeof phoneUsers.$inferInsert;

/**
 * 邀请码表
 * 管理员生成，用户注册时消耗
 */
export const inviteCodes = pgTable("invite_codes", {
  id: serial("id").primaryKey(),
  /** 邀请码字符串（唯一） */
  code: varchar("code", { length: 32 }).notNull().unique(),
  /** 备注（管理员填写，如"给某某用"） */
  note: varchar("note", { length: 255 }),
  /** 最大使用次数（0 表示不限次） */
  maxUses: integer("maxUses").default(1).notNull(),
  /** 已使用次数 */
  usedCount: integer("usedCount").default(0).notNull(),
  /** 是否已禁用 */
  isDisabled: boolean("isDisabled").default(false).notNull(),
  /** 过期时间（null 表示永不过期） */
  expiresAt: timestamp("expiresAt"),
  /** 创建者（管理员）的 phoneUsers.id */
  createdBy: integer("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type InviteCode = typeof inviteCodes.$inferSelect;
export type InsertInviteCode = typeof inviteCodes.$inferInsert;

/**
 * 邀请码使用记录
 */
export const inviteCodeUses = pgTable("invite_code_uses", {
  id: serial("id").primaryKey(),
  /** 使用的邀请码 id */
  inviteCodeId: integer("inviteCodeId").notNull(),
  /** 使用者的 phoneUsers.id */
  usedBy: integer("usedBy").notNull(),
  usedAt: timestamp("usedAt").defaultNow().notNull(),
});

export type InviteCodeUse = typeof inviteCodeUses.$inferSelect;
