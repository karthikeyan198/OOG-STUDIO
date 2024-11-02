window.addEventListener("load", (event) => {
    
    // function generatePDF() {
    //     // console.log(document.querySelector('iframe').contentWindow.document.querySelector('#pdf_container'));
    //      printPDFTemplate();
    //     // return;
    //     // const htmlElement = document.querySelector('iframe').contentWindow.document.querySelector('#pdf_container');
    //     // const htmlElement = document.querySelector('iframe').contentWindow;
    //     // htmlElement.focus();
    //     // htmlElement.print();
    //     // jsPdf.html(htmlElement, opt);
    //     // html2canvas(htmlElement).then((canvas) => {
    //     //     let base64image = canvas.toDataURL('image/png');

    //     //     let pdf = new jsPDF('p', 'px', [2480 , 3508]);
    //     //     pdf.addImage(base64image, 'PNG', 10, 10, 2400, 3490);
    //     //     pdf.save('Invoice.pdf')
    //     // })
    // }
    
    let AccuntDetails = {
        AC_NAME : "Venkatesh",
        AC_NO : 201012522348,
        BANK : "Indusind Bank",
        BRANCH : "Dharmapuri",
        IFSC : 'INDB0000202',
        UPI : 'oogphotography@oksbi',
    }

    let termsAndConditions = [
        '5% of Amount to be paid after the booking is Confirmed',
        '75% of Amount to be paid after the event was Completed',
        'Remaining 20% of amount to be paid agter the total working process Completed',
    ];
    let notes = 'If any quries about the order details please visit out Studio directly for you convience.';

    let projectOptions = {
        'photo' : 'Photo Graphy',
        'video' : 'Video Graphy',
        'other' : 'Other',
    }

    let option = '<option>Select a Project</option>';

    Object.keys(projectOptions).forEach(function (key) {
        option+=`<option value="${key}">${projectOptions[key]}</option>`;
    })
    
    document.getElementById('project').innerHTML = option;
    
    let generateBtn = document.getElementById('generate-btn');
    let customer_name = document.querySelector('#customer-name');
    let customer_phone = document.querySelector('#customer-phone');

    customer_name.addEventListener('keyup', function () {
        if(this.value == '') {
            this.classList.add('error-border');
        }else 
            this.classList.remove('error-border');
    })

    customer_phone.addEventListener('keyup', function () {
        if(this.value == '' || this.value.length < 10 || this.value.length > 10) {
            this.classList.add('error-border');
        }else 
            this.classList.remove('error-border');
    })
    
    generateBtn.addEventListener('click', function() {
        // generatePDF();
        printPDFTemplate();
    });
    
    document.getElementById('project').addEventListener('change', function () {

        let projectContainer = document.querySelector('#project-name-container');

        if(this.value == 'other') {
            projectContainer.classList.remove('d-none');
        } else {
            projectContainer.classList.add('d-none');
        }
    })

    document.querySelector('#service').addEventListener('keyup', function(){
        if(this.value == ''){
            document.querySelector('#service').classList.add('error-border')
        } else
            document.querySelector('#service').classList.remove('error-border');
    })
    
    document.querySelector('#amount').addEventListener('keyup', function(){
        let amountEl = document.querySelector('#amount');
        if(this.value == ''){
            amountEl.classList.add('error-border');
        }else
            amountEl.classList.remove('error-border');
    })

    let serviceData = [];
    let serviceTotle = [];
    getServiceData();

    function getServiceData() {
        let serviceTbody = '';
        let sno = 0; 

        if(serviceData.length > 0) {
            serviceData.forEach(element => {
                sno+=1;
                serviceTbody+=`<tr>
                    <td>${sno}</td>
                    <td>${element.service}</td>
                    <td>${element.amount}</td>
                    <td><a class="service-remove btn text-danger" data-id="${element.id}"><i class="fa-solid fa-trash"></i></a></td>
                </tr>`;
            });
    
            serviceTbody+=`<tr>
                        <td></td>
                        <th>Total</th>
                        <td><i class="fa-solid fa-indian-rupee-sign"></i> ${serviceTotle.Total??0}</td>
                    </tr>`;
        }


        document.querySelector('.service-tbody').innerHTML = serviceTbody;
    }

    document.querySelector('.service-add').addEventListener('click', function(){
        let service = document.querySelector('#service').value;
        let amount = document.querySelector('#amount').value;

        if(!service && !amount) {
            document.querySelector('#service').classList.add('error-border');
            document.querySelector('#amount').classList.add('error-border');
            return toastr.error('Please enter service and amount');
        }
        if(!service){
            return toastr.error('Please enter service');
        }
        if(!amount){
            return toastr.error('Please enter amount');
        }
        let seriveTotalAmount = 0;


        var data = {
            id    : serviceData.length+1,
            service : service,
            amount : amount
        }

        document.querySelector('#service').value = '';
        document.querySelector('#amount').value = '';

        serviceData.push(data);
        
        serviceData.forEach(function (service) {
            seriveTotalAmount+= parseInt(service.amount);
        })
        serviceTotle['Total'] = seriveTotalAmount;
        
        getServiceData();
        
    })

    document.querySelector('.service-tbody').addEventListener('click', function(event) {
        if (event.target.classList.contains('service-remove')) {
            let serviceDataId = event.target.dataset.id;
            removeServiceData(serviceDataId);
        }
    });

    function removeServiceData(serviceDataId) {
        let seriveTotalAmountUpdate = 0;

        filterData = serviceData.filter((a, i) => {
            if(serviceDataId == a.id) {
                serviceData.splice(i,1);
                seriveTotalAmountUpdate = serviceTotle.Total - parseInt(a.amount);
                serviceTotle['Total'] = seriveTotalAmountUpdate;

                getServiceData();
            }
        });
        
    }

    function printPDFTemplate() 
    {
        let serviceTbody = '';
        let sno = 0; 
        let errorCount = 0;
        
        let customer_name       = document.querySelector('#customer-name').value;
        let customer_address    = document.querySelector('#customer-address').value;
        let customer_email      = document.querySelector('#customer-email').value;
        let customer_phone      = document.querySelector('#customer-phone').value;
        let invoice_no          = document.querySelector('#invoice-no').value;
        let invoiceDate         = document.querySelector('#invoice-date').value;

        if(customer_name == '') {
            document.querySelector('#customer-name').classList.add('error-border');
            errorCount++;
        }
        if(customer_phone == '') {
            document.querySelector('#customer-phone').classList.add('error-border');
            errorCount++;
        }
        if(invoice_no == '') {
            document.querySelector('#invoice-no').classList.add('error-border');
            errorCount++;
        }

        if(serviceData.length == 0) {
            document.querySelector('#service').classList.add('error-border');
            document.querySelector('#amount').classList.add('error-border');
            toastr.error('Please enter service and amount');
        }

        // Project Details
        let projectDetails = document.querySelector('#project').value;
        let projectName = document.querySelector('#project').value;

        if(projectName == '') {
            toastr.error('Please enter project details')
            errorCount++;
        }

        if(projectDetails == 'photo') {
            projectName = 'Photo Graphy';
        }
        else if(projectDetails == 'video') {
            projectName = 'Video Graphy';
        }
        else if(projectDetails == 'other') {
            projectName = document.querySelector('#project-name').value;
        }

        
        if(errorCount == 0 && serviceData.length != 0) {

            // terms and conditions with notes
            let conditions = "";

            termsAndConditions.forEach(function(value) {
                conditions+=`<li>${value}</li>`;
            })

            document.querySelector('iframe').contentWindow.document.querySelector('.template-terms-conditions').innerHTML = conditions;    
            document.querySelector('iframe').contentWindow.document.querySelector('.template-notes').innerText = notes;    

            // account details
            document.querySelector('iframe').contentWindow.document.querySelector('.account-holder-name').innerHTML = AccuntDetails.AC_NAME;    
            document.querySelector('iframe').contentWindow.document.querySelector('.account-no').innerHTML = AccuntDetails.AC_NO;    
            document.querySelector('iframe').contentWindow.document.querySelector('.bank-name').innerHTML = AccuntDetails.BANK;    
            document.querySelector('iframe').contentWindow.document.querySelector('.account-ifsc').innerHTML = AccuntDetails.IFSC;    
            document.querySelector('iframe').contentWindow.document.querySelector('.branch').innerHTML = AccuntDetails.BRANCH;    
            document.querySelector('iframe').contentWindow.document.querySelector('.account-upi').innerHTML = AccuntDetails.UPI;    
            
            // customer details
            document.querySelector('iframe').contentWindow.document.querySelector('.template-customer-name').innerText = customer_name;    
            document.querySelector('iframe').contentWindow.document.querySelector('.template-customer-phone').innerText = customer_phone;
            
            if(customer_email == '') {
                document.querySelector('iframe').contentWindow.document.querySelector('.template-customer-email').classList.add('d-none');
            } else {
                document.querySelector('iframe').contentWindow.document.querySelector('.template-customer-email').classList.remove('d-none');
                document.querySelector('iframe').contentWindow.document.querySelector('.template-customer-email').innerText = customer_email;
            }
    
            if(customer_address == '') {
                document.querySelector('iframe').contentWindow.document.querySelector('.template-customer-address').classList.add('d-none');
            } else {
                document.querySelector('iframe').contentWindow.document.querySelector('.template-customer-address').classList.remove('d-none');
                document.querySelector('iframe').contentWindow.document.querySelector('.template-customer-address').innerText = customer_address;
            }

            // Invoice details and project details
            if(invoiceDate == '') {
                invoiceDate = formatDate(new Date());
            } else {
                invoiceDate = formatDate(invoiceDate);
            }

            document.querySelector('iframe').contentWindow.document.querySelector('.template-invoice-id').innerText = invoice_no;
            document.querySelector('iframe').contentWindow.document.querySelector('.template-invoice-date').innerText = invoiceDate;
            document.querySelector('iframe').contentWindow.document.querySelector('.template-project-detail').innerText = projectName;
    
            serviceData.forEach(element => {
                sno+=1;
                serviceTbody+=`<tr>
                    <td>${sno}</td>
                    <td>${element.service}</td>
                    <td>${element.amount}</td>
                </tr>`;
            });
    
            serviceTbody+=`<tr>
                        <td></td>
                        <th>Total</th>
                        <td><i class="fa-solid fa-indian-rupee-sign"></i> ${serviceTotle.Total??0}</td>
                    </tr>`;
    
            document.querySelector('iframe').contentWindow.document.querySelector('#pdf-serivce-tbody').innerHTML = serviceTbody;

            // Print document
            const htmlElement = document.querySelector('iframe').contentWindow;
            htmlElement.focus();
            htmlElement.print();
        }
    }

    function formatDate(date) {
        var d = new Date(date),
            month   = '' + (d.getMonth() + 1),
            day     = '' + d.getDate(),
            year    = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [day, month, year].join('/');
    }
    
});
