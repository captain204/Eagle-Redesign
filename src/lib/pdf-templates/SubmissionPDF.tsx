import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0070f3',
    },
    section: {
        marginBottom: 10,
    },
    header: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
        padding: 5,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 5,
    },
    label: {
        width: 120,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        padding: 5,
        fontWeight: 'bold',
    },
    col1: { width: '40%' },
    col2: { width: '20%' },
    col3: { width: '20%' },
    col4: { width: '20%' },
});

export const SubmissionPDF = ({ submission, ambassador, distributor }: any) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Product Availability Request Summary</Text>

            <View style={styles.section}>
                <Text style={styles.header}>Ambassador Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{ambassador?.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{ambassador?.email}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Location:</Text>
                    <Text style={styles.value}>{ambassador?.lga}{ambassador?.area ? ` (${ambassador.area})` : ""}, {ambassador?.state}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Distributor Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Business Name:</Text>
                    <Text style={styles.value}>{distributor?.businessName || 'Distributor Not Found'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Contact:</Text>
                    <Text style={styles.value}>{distributor?.contactPerson}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Location:</Text>
                    <Text style={styles.value}>{distributor?.lga}{distributor?.area ? ` (${distributor.area})` : ""}, {distributor?.state}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Requested Products</Text>
                <View style={styles.tableHeader}>
                    <Text style={styles.col1}>Product</Text>
                    <Text style={styles.col2}>Qty</Text>
                    <Text style={styles.col3}>Exp. Price</Text>
                    <Text style={styles.col4}>Status</Text>
                </View>
                {submission.items.map((item: any, index: number) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.col1}>{item.product?.title || 'Unknown'}</Text>
                        <Text style={styles.col2}>{item.quantity}</Text>
                        <Text style={styles.col3}>{item.expectedPrice || '-'}</Text>
                        <Text style={styles.col4}>{item.availabilityStatus}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Notes</Text>
                <Text>{submission.adminNotes || 'No notes provided.'}</Text>
            </View>

            <Text style={{ position: 'absolute', bottom: 30, right: 30, fontSize: 10, color: '#aaa' }}>
                Generated on {new Date().toLocaleDateString()} - 1stEagle Portal
            </Text>
        </Page>
    </Document>
);
