// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
}

interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  address?: UserAddress;
  preferences?: UserPreferences;
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: 'customer' | 'admin';
  lastLogin?: Date;
  isActive: boolean;
}

const AddressSchema = new Schema<UserAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' }
});

const PreferencesSchema = new Schema<UserPreferences>({
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: false },
  marketingEmails: { type: Boolean, default: false },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  currency: { type: String, default: 'USD' },
  language: { type: String, default: 'en' }
});

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  address: {
    type: AddressSchema,
    default: null
  },
  preferences: {
    type: PreferencesSchema,
    default: () => ({})
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      return ret;
    }
  }
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ emailVerified: 1 });
UserSchema.index({ createdAt: -1 });

// Pre-save middleware to update firstName and lastName based on name
UserSchema.pre('save', function(next) {
  if (this.isModified('name') && this.name) {
    const nameParts = this.name.trim().split(' ');
    if (nameParts.length >= 2) {
      this.firstName = nameParts[0];
      this.lastName = nameParts.slice(1).join(' ');
    } else {
      this.firstName = this.name;
    }
  }
  next();
});

// Instance methods
UserSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static methods
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

UserSchema.statics.countByRole = function(role: string) {
  return this.countDocuments({ role, isActive: true });
};

export const User = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);