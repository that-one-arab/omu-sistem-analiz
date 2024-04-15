// SELECT statements
const selectCount =
    'SELECT count(*) FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id'
const selectDetails =
    'SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service AS service_id, services.name AS service_name, sales_applications_details.selected_offer AS offer_id, offers.name AS offer_name, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date, sales_applications_details.image_urls FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id INNER JOIN services ON services.service_id = sales_applications_details.selected_service INNER JOIN offers ON offers.offer_id = sales_applications_details.selected_offer'

// CONDITION statements
const conditionSubmitter = 'sales_applications.submitter = '
const conditionStatus = 'sales_applications.status = '
const conditionService = 'sales_applications_details.selected_service = '

const extractMonthCondition =
    'EXTRACT(MONTH FROM sales_applications.submit_time) = '
const extractYearCondition =
    'EXTRACT(YEAR FROM sales_applications.submit_time) = '
const extractDayCondition =
    'EXTRACT(DAY FROM sales_applications.submit_time) = '

module.exports = {
    dealerApplicationsSql: {
        selectCount,
        selectDetails,
        conditionSubmitter,
        conditionStatus,
        conditionService,
        extractMonthCondition,
        extractYearCondition,
        extractDayCondition,
    },
}
