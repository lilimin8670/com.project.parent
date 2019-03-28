import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.repository.Deployment;
import org.junit.Test;

import javax.annotation.Resource;

public class ActivityTest extends BaseTest{

    @Resource
    private ProcessEngineConfiguration processEngineConfiguration;

    @Resource
    private RepositoryService repositoryService;
    @Resource
    private RuntimeService runtimeService;
    /***
     * activity生成表结构(23张)
     */
    @Test
    public void test(){
        processEngineConfiguration.setDatabaseSchemaUpdate(processEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
        ProcessEngine processEngine = processEngineConfiguration.buildProcessEngine();
        System.out.println(processEngine);
    }

    /**
     * 部署流程定义
     *
     * 流程部署表 act_re_deployment
     * 流程资源表 act_ge_bytearray
     * 流程定义表 act_re_procdef
     */
    @Test
    public void test1(){
        //部署流程实例
        Deployment deployment = repositoryService.createDeployment().addClasspathResource("diagrams/first.bpmn").deploy();
        System.out.println(deployment);
    }
    /**
     * 启动流程实例
     *act_ru_execution 流程实例表
     *act_ru_task 会产生一条待执行的任务记录
     *act_hi_taskinst 也会产生一条历史任务记录(注意:endtime is null)
     * table:act_re_procdef
     */
    @Test
    public void test2(){
        runtimeService.startProcessInstanceById("myProcess_1:1:5004");
    }

    /***
     * 流程的激活\挂起
     */
    public void test3(){
        //激活
        repositoryService.activateProcessDefinitionById("myProcess_1:1:5004", true, null);
        //挂起
        repositoryService.suspendProcessDefinitionById("myProcess_1:1:5004", true, null);
    }
}
