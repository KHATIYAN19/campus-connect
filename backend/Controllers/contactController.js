const Contact = require('../Models/Contact');

const contactController = {
    createContact: async (req, res) => {
        try {
            console.log(req.body.data);
            const { name, email, phone, message } = req.body.data;
            if(!name||!email||!phone||!message){
                return res.status(400).json({
                    message:"All Feild are necessary",
                    success:false
                })
            }
            const newContact = new Contact({ name, email, phone, message });
            await newContact.save();
            res.status(201).json({ message: 'Query Sent', contact: newContact, success:true });
        } catch (error) {
            res.status(500).json({ message: 'Something Went Wrong', error });
        }
    },

    getContacts: async (req, res) => {
        try {
            const contacts = await Contact.find();
            res.status(200).json({
                contacts,
                success:true,
                message:"All Fetched"
            }
            );
        } catch (error) {
            res.status(500).json({ message: 'Error fetching contacts', error,success:false });
        }
    },

    getContactById: async (req, res) => {
        try {
            const contact = await Contact.find({email:req.params.email});
            if (!contact) {
                return res.status(404).json({success:true, message: 'Contact not found' });
            }
            res.status(200).json(contact);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching contact', error });
        }
    },
    deleteContact: async (req, res) => {
        try {
            const deletedContact = await Contact.findByIdAndDelete(req.params.id);
            if (!deletedContact) {
                return res.status(404).json({ message: 'Contact not found' });
            }
            res.status(200).json({ message: 'Contact deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting contact', error });
        }
    }
};

module.exports = contactController;