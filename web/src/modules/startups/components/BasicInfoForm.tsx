/**
 * Basic Info Form - Collect startup basic information
 */
import React, { useState } from 'react';
import type { StartupCreateRequest } from '../api/types';
import './BasicInfoForm.css';

interface BasicInfoFormProps {
  onSubmit: (data: StartupCreateRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<StartupCreateRequest>({
    name: '',
    founder_name: '',
    email: '',
    phone: '',
    website: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StartupCreateRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StartupCreateRequest, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Startup name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Startup name must be at least 2 characters';
    }

    if (!formData.founder_name.trim()) {
      newErrors.founder_name = 'Founder name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Remove website if empty
    const submitData = { ...formData };
    if (!submitData.website?.trim()) {
      delete submitData.website;
    }

    await onSubmit(submitData);
  };

  const handleChange = (field: keyof StartupCreateRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="basic-info-form">
      <div className="basic-info-form__field">
        <label htmlFor="name" className="basic-info-form__label">
          Startup Name <span className="basic-info-form__required">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`basic-info-form__input ${errors.name ? 'basic-info-form__input--error' : ''}`}
          placeholder="Enter your startup name"
          disabled={isSubmitting}
        />
        {errors.name && <span className="basic-info-form__error">{errors.name}</span>}
      </div>

      <div className="basic-info-form__field">
        <label htmlFor="founder_name" className="basic-info-form__label">
          Founder Name <span className="basic-info-form__required">*</span>
        </label>
        <input
          type="text"
          id="founder_name"
          value={formData.founder_name}
          onChange={(e) => handleChange('founder_name', e.target.value)}
          className={`basic-info-form__input ${errors.founder_name ? 'basic-info-form__input--error' : ''}`}
          placeholder="Enter your full name"
          disabled={isSubmitting}
        />
        {errors.founder_name && (
          <span className="basic-info-form__error">{errors.founder_name}</span>
        )}
      </div>

      <div className="basic-info-form__field">
        <label htmlFor="email" className="basic-info-form__label">
          Email <span className="basic-info-form__required">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`basic-info-form__input ${errors.email ? 'basic-info-form__input--error' : ''}`}
          placeholder="your@email.com"
          disabled={isSubmitting}
        />
        {errors.email && <span className="basic-info-form__error">{errors.email}</span>}
      </div>

      <div className="basic-info-form__field">
        <label htmlFor="phone" className="basic-info-form__label">
          Phone <span className="basic-info-form__required">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`basic-info-form__input ${errors.phone ? 'basic-info-form__input--error' : ''}`}
          placeholder="+1 (555) 123-4567"
          disabled={isSubmitting}
        />
        {errors.phone && <span className="basic-info-form__error">{errors.phone}</span>}
      </div>

      <div className="basic-info-form__field">
        <label htmlFor="website" className="basic-info-form__label">
          Website <span className="basic-info-form__optional">(Optional)</span>
        </label>
        <input
          type="url"
          id="website"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          className={`basic-info-form__input ${errors.website ? 'basic-info-form__input--error' : ''}`}
          placeholder="https://yourstartup.com"
          disabled={isSubmitting}
        />
        {errors.website && <span className="basic-info-form__error">{errors.website}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="basic-info-form__submit"
      >
        {isSubmitting ? 'Creating Profile...' : 'Continue'}
      </button>
    </form>
  );
};
