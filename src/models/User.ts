// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  address?: UserAddress;
  preferences?: UserPreferences;
  role: 'customer' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationCode?: string;
  emailVerificationExpires?: Date;
  pendingEmail?: string;
  emailChangeToken?: string;
  emailChangeCode?: string;
  emailChangeExpires?: Date;
  passwordResetToken?: string;
  passwordResetCode?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateLastLogin(): Promise<void>;
  generatePasswordResetToken(): string;
  generatePasswordResetCode(): string;
  generateEmailVerificationCode(): string;
  generateEmailChangeCode(): string;
}

export interface IUserModel extends mongoose.Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByResetToken(token: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'US' }
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false },
    theme: { 
      type: String, 
      enum: ['light', 'dark', 'system'], 
      default: 'system' 
    },
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' }
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationCode: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  pendingEmail: {
    type: String,
    lowercase: true,
    trim: true,
    select: false
  },
  emailChangeToken: {
    type: String,
    select: false
  },
  emailChangeCode: {
    type: String,
    select: false
  },
  emailChangeExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetCode: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationCode;
      delete ret.emailVerificationExpires;
      delete ret.pendingEmail;
      delete ret.emailChangeToken;
      delete ret.emailChangeCode;
      delete ret.emailChangeExpires;
      delete ret.passwordResetToken;
      delete ret.passwordResetCode;
      delete ret.passwordResetExpires;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function(this: IUser) {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.name;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(this: IUser, next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware to set firstName and lastName from name
userSchema.pre('save', function(this: IUser, next) {
  if (this.isModified('name') && this.name && (!this.firstName || !this.lastName)) {
    const nameParts = this.name.trim().split(' ');
    if (nameParts.length >= 2) {
      this.firstName = this.firstName || nameParts[0];
      this.lastName = this.lastName || nameParts.slice(1).join(' ');
    } else if (nameParts.length === 1) {
      this.firstName = this.firstName || nameParts[0];
      this.lastName = this.lastName || '';
    }
  }
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to update last login
userSchema.methods.updateLastLogin = async function(this: IUser): Promise<void> {
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

// Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function(this: IUser): string {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token expires in 10 minutes
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

// Instance method to generate password reset code
userSchema.methods.generatePasswordResetCode = function(this: IUser): string {
  const crypto = require('crypto');

  // Generate 6-digit reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Generate random token for URL (optional fallback)
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetCode = resetCode;

  // Code expires in 15 minutes (shorter for security)
  this.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

  return resetCode;
};

// Instance method to generate email verification code
userSchema.methods.generateEmailVerificationCode = function(this: IUser): string {
  const crypto = require('crypto');

  // Generate 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Generate random token for URL
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.emailVerificationCode = verificationCode;

  // Code expires in 30 minutes
  this.emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000);

  return verificationCode;
};

// Instance method to generate email change code
userSchema.methods.generateEmailChangeCode = function(this: IUser): string {
  const crypto = require('crypto');

  // Generate 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Generate random token for URL
  const changeToken = crypto.randomBytes(32).toString('hex');

  this.emailChangeToken = crypto
    .createHash('sha256')
    .update(changeToken)
    .digest('hex');

  this.emailChangeCode = verificationCode;

  // Code expires in 30 minutes
  this.emailChangeExpires = new Date(Date.now() + 30 * 60 * 1000);

  return verificationCode;
};

// Static method to find user by email
userSchema.statics.findByEmail = async function(
  this: IUserModel,
  email: string
): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

// Static method to find user by reset token
userSchema.statics.findByResetToken = async function(
  this: IUserModel,
  token: string
): Promise<IUser | null> {
  const crypto = require('crypto');
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }
  });
};

// Create compound index for better query performance
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ passwordResetToken: 1, passwordResetExpires: 1 });

// Ensure the model is only compiled once
// Delete the cached model if it exists to ensure new methods are loaded
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);