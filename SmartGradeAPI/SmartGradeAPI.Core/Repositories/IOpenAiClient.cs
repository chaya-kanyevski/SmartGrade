using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Repositories
{
    public interface IOpenAiClient
    {
        Task<string> SendPromptAsync(string prompt);
    }

}
