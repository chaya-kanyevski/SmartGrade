namespace SmartGradeAPI.API.Models
{
    public class StudentUploadPost
    {
        public int UserId { get; set; }
        public int? ExamId { get; set; }
        public string StudentName { get; set; }
        public string FilePath { get; set; }//הניתוב של הקובץ בעצמו מAWS
    }
}
