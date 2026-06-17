export default function ContactDetailsStep({ formData, errors, onChange, countries }) {
  return (
    <div className="form-section">
      <h2>Contact Details</h2>
      <hr />

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="personalEmail">Personal Email *</label>
          <input
            id="personalEmail"
            name="personalEmail"
            type="email"
            placeholder="e.g. john@gmail.com"
            value={formData.personalEmail}
            onChange={onChange}
          />
          {errors.personalEmail && <span className="field-error">{errors.personalEmail}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            placeholder="+91 9876543210"
            value={formData.mobileNumber}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="postalAddress">Postal Address</label>
        <input
          id="postalAddress"
          name="postalAddress"
          type="text"
          placeholder="Street / Building / Area"
          value={formData.postalAddress}
          onChange={onChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="e.g. Kochi"
            value={formData.city}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          {/* Options come from the Countries collection via getCountries() in employeeService.js */}
          <select id="country" name="country" value={formData.country} onChange={onChange}>
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}