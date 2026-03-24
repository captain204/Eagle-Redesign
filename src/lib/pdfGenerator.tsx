import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { SubmissionPDF } from './pdf-templates/SubmissionPDF';

export const generateSubmissionPDF = async (submission: any, ambassador: any, distributor: any) => {
    try {
        const buffer = await renderToBuffer(
            React.createElement(SubmissionPDF, { submission, ambassador, distributor })
        );
        return buffer;
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    }
};
