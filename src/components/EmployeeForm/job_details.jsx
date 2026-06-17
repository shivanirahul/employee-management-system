export default function JobDetailsStep({ formData, errors, onChange, designations }) {
  return (
    <div className="form-section">
      <h2>Job Details</h2>
      <hr />

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="designation">Designation</label>
          {/* Options come from the Designations collection via getDesignations() in employeeService.js */}
          <select
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={onChange}
          >
            <option value="">Select designation</option>
            {designations.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="basicPay">Basic Pay (₹)</label>
          <input
            id="basicPay"
            name="basicPay"
            type="number"
            placeholder="e.g. 50000"
            value={formData.basicPay}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}