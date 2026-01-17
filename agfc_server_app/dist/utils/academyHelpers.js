"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.academyHelpers = void 0;
exports.academyHelpers = {
    calculateAge: (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    },
    determineSquadCategory: (age) => {
        if (age >= 15 && age <= 17)
            return 'U17';
        if (age > 17 && age <= 19)
            return 'U19';
        if (age > 19 && age <= 21)
            return 'U21';
        return null;
    },
    validateApplicationCompleteness: (data) => {
        const errors = [];
        if (!data.videoUrl)
            errors.push('Highlight video URL is required.');
        if (!data.position)
            errors.push('Position is required.');
        if (!data.preferredFoot)
            errors.push('Preferred foot is required.');
        return errors;
    }
};
//# sourceMappingURL=academyHelpers.js.map